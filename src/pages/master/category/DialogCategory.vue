<script setup lang="ts">
  import { ref, defineProps, toRefs, reactive, watch, onMounted } from "vue"
  import {
    FormLabel,
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
  import {
    IService,
    IServiceCategoryInput,
    IServiceInput,
  } from "@/_helper/types-api"
  import { toast } from "vue3-toastify"
  import fetchWrapper from "@/utils/axios/fetch-wrapper"

  const props = defineProps({
    modalPreview: Boolean,
    isEdit: Boolean,
    data: Object,
  })

  const emit = defineEmits<{
    (e: "close", value: boolean): void
    (e: "update"): void
  }>()

  const formData = reactive<IServiceCategoryInput>({
    _id: "",
    categoryName: "",
  })

  const initialFormData = { ...formData }

  const rules = {
    categoryName: {
      required,
    },
  }

  watch(props, (newValue: any): any => {
    if (newValue.isEdit) {
      formData._id = newValue?.data._id || ""
      formData.categoryName = newValue?.data.categoryName || ""
    }
  })

  const closeModal = () => {
    validate.value.$reset()
    Object.assign(formData, initialFormData)
    emit("close", false)
  }

  const validate = useVuelidate(rules, toRefs(formData))
  const onSubmit = async () => {
    validate.value.$touch()
    if (validate.value.$invalid) {
      toast.error("error")
    } else {
      try {
        const saveData = {
          categoryName: formData.categoryName,
        }
        if (props.isEdit) {
          const categoryId = props.data?._id
          const response = await fetchWrapper.put(
            `item/category/${categoryId}`,
            saveData
          )
          toast.success(response.message)
          validate.value.$reset()
          emit("update")
          Object.assign(formData, initialFormData)
        } else {
          const response = await fetchWrapper.post(
            "item/category",
            saveData
          )
          toast.success(response.message)
          validate.value.$reset()
          emit("update")
          Object.assign(formData, initialFormData)
        }
      } catch (error: any) {
        toast.error(error.response?.data.message)
      }
    }
  }

  const sendButtonRef = ref(null)
</script>

<template>
  <Dialog
    :open="props.modalPreview"
    @close="closeModal"
    :initialFocus="sendButtonRef">
    <Dialog.Panel>
      <Dialog.Title>
        <h2 class="mr-auto text-base font-medium">
          {{ props.isEdit ? "Edit Category" : "Add Category" }}
        </h2>
      </Dialog.Title>
      <Dialog.Description>
        <form class="validate-form grid gap-4" @submit.prevent="onSubmit">
          <div class="input-form">
            <FormLabel
              htmlFor="validation-form-1"
              class="flex flex-col w-full sm:flex-row">
              Nama Category
            </FormLabel>
            <FormInput
              id="validation-form-1"
              v-model.trim="validate.categoryName.$model"
              type="text"
              name="categoryName"
              :class="{
                'border-danger': validate.categoryName.$error,
              }"
              placeholder="Tuliskan ..." />
            <template v-if="validate.categoryName.$error">
              <div
                v-for="(error, index) in validate.categoryName.$errors"
                :key="index"
                class="mt-2 text-danger">
                {{ error.$message }}
              </div>
            </template>
          </div>
          <Button variant="primary" type="submit" class="mt-5"> Save </Button>
        </form>
      </Dialog.Description>
    </Dialog.Panel>
  </Dialog>
</template>
