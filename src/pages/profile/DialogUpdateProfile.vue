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

  const formData = reactive<IUserInput>({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    gender: "",
  })
  const initialFormData = { ...formData }

  const closeModal = () => {
    Object.assign(formData, initialFormData)
    emit("close", false)
  }

  const rules = {
    firstName: {
      required,
    },
    lastName: {
      required,
    },
    email: {
      required,
      email,
    },
  }
  const validate = useVuelidate(rules, toRefs(formData))
  const onSubmit = async () => {
    validate.value.$touch()
    if (validate.value.$invalid) {
      toast.error("error")
    } else {
      try {
        // const itemCode = props.item?.itemCode
        // const response = await fetchWrapper.post(
        //   `employee/assignTask/${itemCode}`
        // )
        // toast.success(response.message)
        validate.value.$reset()
        emit("update")
        closeModal()
      } catch (error: any) {
        toast.error(error.response?.data.message)
      }
    }
  }
  const sendButtonRef = ref(null)
  const getUserDetail = async () => {
    // try {
    //   const response = await fetchWrapper.get("employee")
    //   formData.value = response as IUserInput
    // } catch (error) {}
  }
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
        <h2 class="mr-auto text-base font-medium">Edit Profile</h2>
      </Dialog.Title>
      <Dialog.Description>
        <form class="validate-form grid gap-4" @submit.prevent="onSubmit">
          <div class="input-form">
            <FormLabel
              htmlFor="validation-form-1"
              class="flex flex-col w-full sm:flex-row">
              Nama Depan
              <!-- <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                Required, at least 2 characters
              </span> -->
            </FormLabel>
            <FormInput
              id="validation-form-1"
              v-model.trim="validate.firstName.$model"
              type="text"
              name="firstName"
              :class="{
                'border-danger': validate.firstName.$error,
              }"
              placeholder="Tuliskan ..." />
            <template v-if="validate.firstName.$error">
              <div
                v-for="(error, index) in validate.firstName.$errors"
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
              Nama Belakang
              <!-- <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                Required, at least 2 characters
              </span> -->
            </FormLabel>
            <FormInput
              id="validation-form-1"
              v-model.trim="validate.lastName.$model"
              type="text"
              name="lastName"
              :class="{
                'border-danger': validate.lastName.$error,
              }"
              placeholder="Tuliskan ..." />
            <template v-if="validate.lastName.$error">
              <div
                v-for="(error, index) in validate.lastName.$errors"
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
              Email
              <!-- <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                Required, at least 2 characters
              </span> -->
            </FormLabel>
            <FormInput
              id="validation-form-1"
              v-model.trim="validate.email.$model"
              type="text"
              name="email"
              :class="{
                'border-danger': validate.email.$error,
              }"
              placeholder="Tuliskan ..." />
            <template v-if="validate.email.$error">
              <div
                v-for="(error, index) in validate.email.$errors"
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
