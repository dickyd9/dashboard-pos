<script setup lang="ts">
  import { ref, defineProps, toRefs, reactive, onMounted } from "vue"
  import {
    FormLabel,
    FormCheck,
    FormSwitch,
    FormInput,
    FormSelect,
  } from "@/base-components/Form"
  import { Menu, Dialog } from "@/base-components/Headless"
  import Button from "@/base-components/Button"
  import Lucide from "@/base-components/Lucide"
  import {
    required,
    minLength,
    maxLength,
    email,
    url,
    integer,
    numeric,
    requiredIf,
  } from "@vuelidate/validators"
  import { useVuelidate } from "@vuelidate/core"
  import { IEmployee, IService, IServiceInput } from "@/_helper/types-api"
  import TomSelect from "@/base-components/TomSelect"
  import { toast } from "vue3-toastify"
  import fetchWrapper from "@/utils/axios/fetch-wrapper"

  const props = defineProps({
    modalPreview: Boolean,
    item: Object,
  })

  const emit = defineEmits<{
    (e: "close", value: boolean): void
    (e: "changeCategory"): void
  }>()

  const employeeList = ref<IEmployee[]>([])
  const formData = reactive({
    employeeCode: "",
  })
  const initialFormData = { ...formData }

  const closeModal = () => {
    Object.assign(formData, initialFormData)
    emit("close", false)
  }

  interface category {
    _id: string
    categoryCode: string
    categoryName: string
  }
  const categoryList = ref<category[]>([])
  const getCategory = async () => {
    try {
      const response = await fetchWrapper.get("master/category")
      categoryList.value = response.data as category[]
    } catch {}
  }

  const onSubmit = async () => {
    try {
      const response = await fetchWrapper.put(
        `item/assign-category/${props.item?._id}`,
        { _id: assignCategory.value?._id }
      )
      toast.success(response.message)
      emit("changeCategory")
      closeModal()
    } catch (error: any) {
      toast.error(error.response?.data.message)
    }
  }
  interface cat {
    _id: string
    categoryName: string
  }
  const sendButtonRef = ref(null)
  const assignCategory = ref<cat>({
    _id: "" as string,
    categoryName: "" as string,
  })

  onMounted(() => {
    setTimeout(() => {
      getCategory()
    }, 20)
  })
</script>

<template>
  <Dialog
    :open="props.modalPreview"
    @close="closeModal"
    :initialFocus="sendButtonRef">
    <Dialog.Panel>
      <Dialog.Title>
        <h2 class="mr-auto text-base font-medium">Service Category</h2>
      </Dialog.Title>
      <Dialog.Description>
        <form class="validate-form grid gap-4" @submit.prevent="onSubmit">
          <div class="my-4 !box">
            <el-select
              class="w-full"
              v-model="assignCategory._id"
              filterable
              placeholder="Select">
              <el-option
                v-for="item in categoryList"
                :key="item.categoryName"
                :label="item.categoryName"
                :value="item._id" />
            </el-select>
          </div>
          <Button variant="primary" type="submit" class="mt-5"> Save </Button>
        </form>
      </Dialog.Description>
    </Dialog.Panel>
  </Dialog>
</template>
