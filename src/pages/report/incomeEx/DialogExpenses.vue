<script setup lang="ts">
  import { ref, defineProps, toRefs, reactive, onMounted } from "vue"
  import {
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
  import {
    IEmployee,
    IExpensesInput,
    IService,
    IServiceInput,
    IUserInput,
  } from "@/_helper/types-api"
  import { toast } from "vue3-toastify"
  import fetchWrapper from "@/utils/axios/fetch-wrapper"

  const props = defineProps({
    modalPreview: Boolean,
    item: Object,
  })

  const emit = defineEmits<{
    (e: "close", value: boolean): void
    (e: "update"): void
  }>()

  const formData = reactive<IExpensesInput>({
    description: "",
    note: "",
    amount: 0,
    price: 0,
  })
  const initialFormData = { ...formData }

  const closeModal = () => {
    Object.assign(formData, initialFormData)
    emit("close", false)
  }

  const rules = {
    description: {
      required,
    },
    amount: {
      required,
    },
    price: {
      required,
    },
  }
  const validate = useVuelidate(rules, toRefs(formData))
  const onSubmit = async () => {
    validate.value.$touch()
    if (validate.value.$invalid) {
      toast.error("error")
    } else {
      try {
        const response = await fetchWrapper.post("report/expenses", formData)
        toast.success(response.message)
        validate.value.$reset()
        closeModal()
        emit("update")
      } catch (error: any) {
        toast.error(error.response?.data.message)
      }
    }
  }
  const sendButtonRef = ref(null)
  onMounted(() => {
    setTimeout(() => {}, 20)
  })
</script>

<template>
  <Dialog
    :open="props.modalPreview"
    @close="closeModal"
    :initialFocus="sendButtonRef">
    <Dialog.Panel>
      <Dialog.Title>
        <h2 class="mr-auto text-base font-medium">Pengeluaran</h2>
      </Dialog.Title>
      <Dialog.Description>
        <form class="validate-form grid gap-4" @submit.prevent="onSubmit">
          <div class="input-form">
            <FormLabel
              htmlFor="validation-form-1"
              class="flex flex-col w-full sm:flex-row">
              Keterangan
              <!-- <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                Required, at least 2 characters
              </span> -->
            </FormLabel>
            <FormInput
              id="validation-form-1"
              v-model.trim="validate.description.$model"
              type="text"
              name="description"
              :class="{
                'border-danger': validate.description.$error,
              }"
              placeholder="Tuliskan ..." />
            <template v-if="validate.description.$error">
              <div
                v-for="(error, index) in validate.description.$errors"
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
              Jumlah
              <!-- <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                Required, at least 2 characters
              </span> -->
            </FormLabel>
            <FormInput
              id="validation-form-1"
              v-model.trim="validate.amount.$model"
              type="number"
              name="amount"
              :class="{
                'border-danger': validate.amount.$error,
              }"
              placeholder="Tuliskan ..." />
            <template v-if="validate.amount.$error">
              <div
                v-for="(error, index) in validate.amount.$errors"
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
              Nominal
              <!-- <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                Required, at least 2 characters
              </span> -->
            </FormLabel>
            <FormInput
              id="validation-form-1"
              v-model.trim="validate.price.$model"
              type="number"
              name="price"
              :class="{
                'border-danger': validate.price.$error,
              }"
              placeholder="Tuliskan ..." />
            <template v-if="validate.price.$error">
              <div
                v-for="(error, index) in validate.price.$errors"
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
              Note
              <!-- <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                Required, at least 2 characters
              </span> -->
            </FormLabel>
            <FormInput
              id="validation-form-1"
              v-model="formData.note"
              type="text"
              name="note"
              placeholder="Tuliskan ..." />
          </div>
          <Button variant="primary" type="submit" class="mt-5"> Save </Button>
        </form>
      </Dialog.Description>
    </Dialog.Panel>
  </Dialog>
</template>
