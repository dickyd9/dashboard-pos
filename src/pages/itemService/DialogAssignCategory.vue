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
  })

  const emit = defineEmits<{
    (e: "close", value: boolean): void
    (e: "changeCategory"): void
  }>()

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
  const serviceList = ref<IService[]>([])
  const serviceSelected = ref({
    _id: "" as string,
    itemName: "" as string,
  })
  const getCategory = async () => {
    try {
      const response = await fetchWrapper.get("master/category")
      categoryList.value = response.data as category[]
    } catch {}
  }
  const getService = async () => {
    try {
      const response = await fetchWrapper.get("master/service")
      serviceList.value = response.data as IService[]
    } catch {}
  }

  const onSubmit = async () => {
    try {
      const response = await fetchWrapper.put(
        `item/assign-category/${serviceSelected.value._id}`,
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
      getService()
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
          <div class="!box">
            <el-select
              class="w-full"
              v-model="serviceSelected._id"
              filterable
              placeholder="Pilih Service">
              <el-option
                v-for="item in serviceList"
                :key="item.itemName"
                :label="item.itemName"
                :value="item._id" />
            </el-select>
          </div>
          <div class="!box">
            <el-select
              class="w-full"
              v-model="assignCategory._id"
              filterable
              placeholder="Pilih Category">
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
