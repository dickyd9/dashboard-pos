<script setup lang="ts">
  import { ref, defineProps, toRefs, reactive, watch } from "vue"
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
  import { ICustomerInput, IService, IServiceInput } from "@/_helper/types-api"
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

  const formData = reactive<ICustomerInput>({
    _id: "",
    customerName: "",
    customerEmail: "",
    customerGender: "",
    customerAddress: "",
    customerContact: 0,
    customerDOB: new Date(),
    createdAt: new Date(),
  })

  const initialFormData = { ...formData }

  const rules = {
    customerName: {
      required,
    },
    customerEmail: {
      required,
      email,
    },
    customerContact: {
      required,
      integer,
    },
    customerGender: {
      required,
    },
  }

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
        const response = await fetchWrapper.post("customer", formData)
        toast.success(response.status)
        validate.value.$reset()
        emit("update")
        Object.assign(formData, initialFormData)
      } catch (error: any) {
        toast.error(error.response?.data.message)
      }
    }
  }

  watch(props, (newValue: any): any => {
    if (newValue.isEdit) {
      formData.customerName = newValue?.data.customerName || ""
      formData.customerAddress = newValue?.data.customerAddress || ""
      formData.customerEmail = newValue?.data.customerEmail || ""
      formData.customerDOB = newValue?.data.customerDOB || new Date()
      formData.customerContact = newValue?.data.customerContact || 0
      formData.customerGender = newValue?.data.customerGender || ""
    }
  })

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
          {{ props.isEdit ? "Edit Customer" : "Add Customer" }}
        </h2>
      </Dialog.Title>
      <Dialog.Description>
        <form class="validate-form grid gap-4" @submit.prevent="onSubmit">
          <div class="input-form">
            <FormLabel
              htmlFor="validation-form-1"
              class="flex flex-col w-full sm:flex-row">
              Nama Customer
              <!-- <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                Required, at least 2 characters
              </span> -->
            </FormLabel>
            <FormInput
              id="validation-form-1"
              v-model.trim="validate.customerName.$model"
              type="text"
              name="customerName"
              :class="{
                'border-danger': validate.customerName.$error,
              }"
              placeholder="Tuliskan ..." />
            <template v-if="validate.customerName.$error">
              <div
                v-for="(error, index) in validate.customerName.$errors"
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
              Email Customer
            </FormLabel>
            <FormInput
              id="validation-form-1"
              v-model.trim="validate.customerEmail.$model"
              type="text"
              name="customerEmail"
              :class="{
                'border-danger': validate.customerEmail.$error,
              }"
              placeholder="Tuliskan ..." />
            <template v-if="validate.customerEmail.$error">
              <div
                v-for="(error, index) in validate.customerEmail.$errors"
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
              No Telpon Customer
            </FormLabel>
            <FormInput
              id="validation-form-1"
              v-model.trim="validate.customerContact.$model"
              type="number"
              name="customerContact"
              :class="{
                'border-danger': validate.customerContact.$error,
              }"
              placeholder="Tuliskan ..." />
            <template v-if="validate.customerContact.$error">
              <div
                v-for="(error, index) in validate.customerContact.$errors"
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
              Gender Customer
            </FormLabel>
            <FormSelect
              v-model.trim="validate.customerGender.$model"
              class="w-full">
              <option value="male">Male</option>
              <option value="female">Female</option>
            </FormSelect>
            <template v-if="validate.customerGender.$error">
              <div
                v-for="(error, index) in validate.customerGender.$errors"
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
