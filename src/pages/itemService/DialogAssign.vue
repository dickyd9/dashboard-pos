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
  import { IEmployee, IService, IServiceInput } from "@/_helper/types-api"
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

  const employeeList = ref<IEmployee[]>([])
  const formData = reactive({
    employeeCode: "",
  })
  const initialFormData = { ...formData }

  const closeModal = () => {
    Object.assign(formData, initialFormData)
    emit("close", false)
  }

  const checkedEmployees = ref<string[]>([])
  const checkAssign = (event: any) => {
    const checkedEmployeeCode = event.target.value
    if (event.target.checked) {
      // Jika dicentang, tambahkan ke array
      checkedEmployees.value.push(checkedEmployeeCode)
    } else {
      // Jika tidak dicentang, hapus dari array
      const index = checkedEmployees.value.indexOf(checkedEmployeeCode)
      if (index > -1) {
        checkedEmployees.value.splice(index, 1)
      }
    }
  }
  const onSubmit = async () => {
    try {
      const itemCode = props.item?.itemCode
      const response = await fetchWrapper.post(
        `employee/assignTask/${itemCode}`,
        checkedEmployees.value
      )
      toast.success(response.message)
      emit("update")
      closeModal()
    } catch (error: any) {
      toast.error(error.response?.data.message)
    }
  }
  const sendButtonRef = ref(null)

  const getEmployee = async () => {
    try {
      const response = await fetchWrapper.get("employee")
      employeeList.value = response.data as IEmployee[]
    } catch (error) {}
  }
  onMounted(() => {
    setTimeout(() => {
      getEmployee()
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
        <h2 class="mr-auto text-base font-medium">Penugasan Karyawan</h2>
      </Dialog.Title>
      <Dialog.Description>
        <form class="validate-form grid gap-4" @submit.prevent="onSubmit">
          <FormCheck
            v-model="checkedEmployees"
            @change="checkAssign"
            class="mt-2"
            v-for="(emp, index) in employeeList"
            :key="index">
            <FormCheck.Input
              id="checkbox-switch-1"
              type="checkbox"
              :value="emp.employeeCode" />
            <FormCheck.Label htmlFor="checkbox-switch-1">
              {{ emp.employeeName }}
            </FormCheck.Label>
          </FormCheck>
          <Button variant="primary" type="submit" class="mt-5"> Save </Button>
        </form>
      </Dialog.Description>
    </Dialog.Panel>
  </Dialog>
</template>
