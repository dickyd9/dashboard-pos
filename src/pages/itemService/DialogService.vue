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
  import { IService, IServiceInput } from "@/_helper/types-api"
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

  const formData = reactive<IServiceInput>({
    _id: "",
    servicesName: "",
    servicesCategory: "",
    servicesPrice: 0,
    servicesPoint: 0,
    servicesStatus: "",
    createdAt: new Date(),
  })

  const initialFormData = { ...formData }

  const rules = {
    servicesName: {
      required,
    },
    servicesPrice: {
      required,
      numeric,
    },
    servicesPoint: {
      integer,
    },
    servicesStatus: {
      required,
    },
  }

  watch(props, (newValue: any): any => {
    if (newValue.isEdit) {
      formData.servicesName = newValue?.data.servicesName || ""
      formData.servicesCategory = newValue?.data.servicesCategory || ""
      formData.servicesPrice = newValue?.data.servicesPrice || 0
      formData.servicesPoint = newValue?.data.servicesPoint || 0
      formData.servicesStatus = newValue?.data.servicesStatus || ""
      formData.createdAt = newValue?.data.createdAt || new Date()
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
          servicesName: formData.servicesName,
          servicesCategory: formData.servicesCategory,
          servicesPrice: formData.servicesPrice,
          servicesPoint: formData.servicesPoint,
          servicesStatus: formData.servicesStatus,
          createdAt: formData.createdAt,
        }
        if (props.isEdit) {
          const servicesId = props.data?._id
          const response = await fetchWrapper.put(
            `services/${servicesId}`,
            saveData
          )
          toast.success(response.status)
          validate.value.$reset()
          emit("update")
          Object.assign(formData, initialFormData)
        } else {
          const response = await fetchWrapper.post("services", saveData)
          toast.success(response.status)
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
          {{ props.isEdit ? "Edit Service" : "Add Service" }}
        </h2>
      </Dialog.Title>
      <Dialog.Description>
        <form class="validate-form grid gap-4" @submit.prevent="onSubmit">
          <div class="input-form">
            <FormLabel
              htmlFor="validation-form-1"
              class="flex flex-col w-full sm:flex-row">
              Nama Service
            </FormLabel>
            <FormInput
              id="validation-form-1"
              v-model.trim="validate.servicesName.$model"
              type="text"
              name="servicesName"
              :class="{
                'border-danger': validate.servicesName.$error,
              }"
              placeholder="Tuliskan ..." />
            <template v-if="validate.servicesName.$error">
              <div
                v-for="(error, index) in validate.servicesName.$errors"
                :key="index"
                class="mt-2 text-danger">
                {{ error.$message }}
              </div>
            </template>
          </div>
          <div class="input-form">
            <FormLabel
              htmlFor="validation-form-1"
              class="flex flex-col w-full sm:flex-row">
              Harga
              <!-- <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                Required, at least 2 characters
              </span> -->
            </FormLabel>
            <FormInput
              id="validation-form-1"
              v-model.trim="validate.servicesPrice.$model"
              type="number"
              name="servicesPrice"
              :class="{
                'border-danger': validate.servicesPrice.$error,
              }"
              placeholder="Tuliskan ..." />
            <template v-if="validate.servicesPrice.$error">
              <div
                v-for="(error, index) in validate.servicesPrice.$errors"
                :key="index"
                class="mt-2 text-danger">
                {{ error.$message }}
              </div>
            </template>
          </div>
          <div class="input-form">
            <FormLabel
              htmlFor="validation-form-1"
              class="flex flex-col w-full sm:flex-row">
              Poin
              <!-- <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                Required, at least 2 characters
              </span> -->
            </FormLabel>
            <FormInput
              id="validation-form-1"
              v-model.trim="validate.servicesPoint.$model"
              type="number"
              name="servicesPoint"
              :class="{
                'border-danger': validate.servicesPoint.$error,
              }"
              placeholder="Tuliskan ..." />
            <template v-if="validate.servicesPoint.$error">
              <div
                v-for="(error, index) in validate.servicesPoint.$errors"
                :key="index"
                class="mt-2 text-danger">
                {{ error.$message }}
              </div>
            </template>
          </div>
          <div class="input-form">
            <FormLabel
              htmlFor="validation-form-1"
              class="flex flex-col w-full sm:flex-row">
              Status
              <!-- <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                Required, at least 2 characters
              </span> -->
            </FormLabel>
            <FormSelect
              v-model.trim="validate.servicesStatus.$model"
              :class="{
                'border-danger': validate.servicesStatus.$error,
              }"
              placeholder="Select ..."
              id="category">
              <option
                v-for="(services, key) in [
                  'Pilih Status',
                  'active',
                  'inactive',
                ]"
                :key="key"
                :value="services">
                {{ services }}
              </option>
            </FormSelect>
            <template v-if="validate.servicesStatus.$error">
              <div
                v-for="(error, index) in validate.servicesStatus.$errors"
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
