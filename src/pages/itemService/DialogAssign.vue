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
    categoryCode: string
    categoryName: string
  }
  const categoryList = ref<category[]>([])
  const getCategory = async () => {
    try {
      const response = await fetchWrapper.get("services/category")
      categoryList.value = response.data as category[]
    } catch {}
  }

  const onSubmit = async () => {
    try {
      const response = await fetchWrapper.put(
        `services/assign-category/${props.item?._id}`,
        { categoryName: assignCategory.value?.categoryName }
      )
      toast.success(response.message)
      emit("changeCategory")
      closeModal()
    } catch (error: any) {
      toast.error(error.response?.data.message)
    }
  }
  interface cat {
    categoryName: string
  }
  const sendButtonRef = ref(null)
  const assignCategory = ref<cat>({
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
            <TomSelect
              v-model="assignCategory.categoryName"
              style="border: 1px !important"
              :options="{
                placeholder: 'Select Category',
              }"
              class="w-full">
              <option
                :value="category.categoryName"
                v-for="(category, index) in categoryList"
                :key="index">
                {{ category?.categoryName }}
              </option>
            </TomSelect>
          </div>
          <Button variant="primary" type="submit" class="mt-5"> Save </Button>
        </form>
      </Dialog.Description>
    </Dialog.Panel>
  </Dialog>
</template>
