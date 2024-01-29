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
  import { IEmployeeInput, IService, IServiceInput } from "@/_helper/types-api"
  import { toast } from "vue3-toastify"
  import Litepicker from "@/base-components/Litepicker"
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

  const formData = reactive<IEmployeeInput>({
    _id: "",
    employeeName: "",
    employeeAddress: "",
    employeeJoinDate: new Date(),
    employeeContact: 0,
    employeeGender: "",
    createdAt: new Date(),
  })

  const initialFormData = { ...formData }

  const rules = {
    employeeName: {
      required,
    },
    employeeAddress: {
      required,
    },
    employeeJoinDate: {
      required,
    },
    employeeContact: {
      integer,
    },
    employeeGender: {
      required,
    },
  }

  watch(props, (newValue: any): any => {
    if (newValue.isEdit) {
      formData.employeeName = newValue?.data.employeeName || ""
      formData.employeeAddress = newValue?.data.employeeAddress || ""
      formData.employeeJoinDate = newValue?.data.employeeJoinDate || ""
      formData.employeeContact = newValue?.data.employeeContact || 0
      formData.employeeGender = newValue?.data.employeeGender || ""
      formData.createdAt = newValue?.data.createdAt || new Date()
    }
  })

  const litePikcerDate = ref("")
  const handleDateChange = (value: any) => {
    formData.employeeJoinDate = new Date(value)
  }

  const closeModal = () => {
    validate.value.$reset()
    Object.assign(formData, initialFormData)
    emit("close", false)
  }

  const validate = useVuelidate(rules, toRefs(formData))
  const onSubmit = async () => {
    validate.value.$touch()
    const saveData = {
      employeeName: formData.employeeName,
      employeeAddress: formData.employeeAddress,
      employeeJoinDate: formData.employeeJoinDate,
      employeeContact: formData.employeeContact,
      employeeGender: formData.employeeGender,
      createdAt: formData.createdAt,
    }
    if (validate.value.$invalid) {
      toast.error("error")
    } else {
      try {
        if (props.isEdit) {
          const employeeId = props.data?._id
          const response = await fetchWrapper.put(
            `employee/${employeeId}`,
            saveData
          )
          toast.success(response.message)
          validate.value.$reset()
          emit("update")
          closeModal()
          Object.assign(formData, initialFormData)
        } else {
          const response = await fetchWrapper.post("employee", saveData)
          toast.success(response.message)
          validate.value.$reset()
          emit("update")
          closeModal()
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
          {{ props.isEdit ? "Edit Karyawan" : "Tambah Karyawan" }}
        </h2>
      </Dialog.Title>
      <Dialog.Description>
        <form class="validate-form grid gap-4" @submit.prevent="onSubmit">
          <div class="grid grid-cols-2 gap-4">
            <div class="input-form">
              <FormLabel
                htmlFor="validation-form-1"
                class="flex flex-col w-full sm:flex-row">
                Nama Karyawan
                <!-- <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                  Required, at least 2 characters
                </span> -->
              </FormLabel>
              <FormInput
                id="validation-form-1"
                v-model.trim="validate.employeeName.$model"
                type="text"
                name="employeeName"
                :class="{
                  'border-danger': validate.employeeName.$error,
                }"
                placeholder="Tuliskan ..." />
              <template v-if="validate.employeeName.$error">
                <div
                  v-for="(error, index) in validate.employeeName.$errors"
                  :key="index"
                  class="mt-2 text-danger">
                  {{ error.$message }}
                </div>
              </template>
            </div>

            <!--  -->
            <div class="input-form">
              <FormLabel
                htmlFor="validation-form-1"
                class="flex flex-col w-full sm:flex-row">
                Nomor Telpon
                <!-- <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                  Required, at least 2 characters
                </span> -->
              </FormLabel>
              <FormInput
                id="validation-form-1"
                v-model.trim="validate.employeeContact.$model"
                type="number"
                name="employeeContact"
                :class="{
                  'border-danger': validate.employeeContact.$error,
                }"
                placeholder="Tuliskan ..." />
              <template v-if="validate.employeeContact.$error">
                <div
                  v-for="(error, index) in validate.employeeContact.$errors"
                  :key="index"
                  class="mt-2 text-danger">
                  {{ error.$message }}
                </div>
              </template>
            </div>

            <!--  -->
            <div class="input-form">
              <FormLabel
                htmlFor="validation-form-1"
                class="flex flex-col w-full sm:flex-row">
                Tanggal Masuk Karyawan
                <!-- <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                  Required, at least 2 characters
                </span> -->
              </FormLabel>
              <Litepicker
                v-model="litePikcerDate"
                :options="{
                  autoApply: false,
                  position: 'botom',
                  showWeekNumbers: true,
                  dropdowns: {
                    minYear: 1990,
                    maxYear: null,
                    months: true,
                    years: true,
                  },
                }"
                class="block"
                @update:modelValue="handleDateChange" />
              <template v-if="validate.employeeJoinDate.$error">
                <div
                  v-for="(error, index) in validate.employeeJoinDate.$errors"
                  :key="index"
                  class="mt-2 text-danger">
                  {{ error.$message }}
                </div>
              </template>
            </div>

            <!--  -->
            <div class="input-form">
              <FormLabel
                htmlFor="validation-form-1"
                class="flex flex-col w-full sm:flex-row">
                Jenis Kelamin
                <!-- <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                  Required, at least 2 characters
                </span> -->
              </FormLabel>
              <el-select
                v-model="formData.employeeGender"
                class="w-full"
                placeholder="Select"
                size="large">
                <el-option
                  v-for="item in [
                    { gender: 'male', label: 'Pria' },
                    { gender: 'female', label: 'Wanita' },
                  ]"
                  :key="item.gender"
                  :label="item.label"
                  :value="item.gender" />
              </el-select>
            </div>

            <!--  -->
            <div class="input-form">
              <FormLabel
                htmlFor="validation-form-1"
                class="flex flex-col w-full sm:flex-row">
                Alamat
                <!-- <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                  Required, at least 2 characters
                </span> -->
              </FormLabel>
              <FormInput
                id="validation-form-1"
                v-model.trim="validate.employeeAddress.$model"
                type="text"
                name="employeeAddress"
                :class="{
                  'border-danger': validate.employeeAddress.$error,
                }"
                placeholder="Tuliskan ..." />
              <template v-if="validate.employeeAddress.$error">
                <div
                  v-for="(error, index) in validate.employeeAddress.$errors"
                  :key="index"
                  class="mt-2 text-danger">
                  {{ error.$message }}
                </div>
              </template>
            </div>
          </div>
          <Button variant="primary" type="submit" class="mt-5"> Save </Button>
        </form>
      </Dialog.Description>
    </Dialog.Panel>
  </Dialog>
</template>
