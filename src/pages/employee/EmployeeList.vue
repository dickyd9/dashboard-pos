<script setup lang="ts">
  import { ref, reactive, onMounted } from "vue"
  import _ from "lodash"
  import fakerData from "@/utils/faker"
  import Button from "@/base-components/Button"
  import Pagination from "@/base-components/Pagination"
  import { FormInput, FormSelect } from "@/base-components/Form"
  import Lucide from "@/base-components/Lucide"
  import { Dialog, Menu } from "@/base-components/Headless"
  import TableEmployee from "./components/TableEmployee.vue"
  import fetchWrapper from "@/utils/axios/fetch-wrapper"
  import {
    IEmployee,
    IEmployeeDialog,
    IEmployeeInput,
    IEmployeeTask,
    IPaginate,
  } from "@/_helper/types-api"
  import { toast } from "vue3-toastify"
  import DialogEmployee from "./components/DialogEmployee.vue"

  //==== Get Data Start ====\\
  const listData = ref<IEmployee[]>([])
  const pagination = ref<IPaginate>()
  const loading: any = ref(true)
  const params = reactive({
    keyword: "",
    current_page: 1,
    pagesize: 20,
    sort_column: "",
    sort_direction: "asc",
  })
  const cols =
    ref([
      { field: "employeeCode", title: "Kode", isUnique: true, sort: false },
      { field: "employeeName", title: "Nama Karyawan" },
      { field: "employeeAddress", title: "Alamat", sort: false },
      {
        field: "employeeContact",
        title: "No. Telpon",
        type: "number",
        sort: false,
      },
      { field: "employeeGender", title: "Gender", sort: false },
      {
        field: "employeeJoinDate",
        title: "Tanggal Bergabung",
        type: "dateTime",
      },
      {
        field: "actions",
        title: "Action",
        sort: false,
      },
    ]) || []

  const getData = async () => {
    try {
      loading.value = true

      const response = await fetchWrapper.get("employee", params)

      listData.value = response?.data as IEmployee[]
      pagination.value = response.meta as IPaginate
    } catch {}

    loading.value = false
  }

  const getParams = (data: any) => {
    params.current_page = data.current_page
    params.pagesize = data.pagesize
    params.sort_column = data.sort_column
    params.sort_direction = data.sort_direction

    getData()
  }
  //==== Get Data End ====\\

  const modalPreview = ref(false)
  const isEdit = ref(false)
  const dataValue = ref<IEmployeeInput>({
    _id: "",
    employeeName: "",
    employeeAddress: "",
    employeeContact: 0,
    employeeJoinDate: new Date(),
    employeeGender: "",
    createdAt: new Date(),
  })

  const initialFormData = { ...dataValue }

  const closeDialog = () => {
    modalPreview.value = false
    isEdit.value = false
    Object.assign(dataValue, initialFormData)
  }

  onMounted(() => {
    setTimeout(() => {
      getData()
    }, 20)
  })

  const deleteConfirmationModal = ref(false)
  const setDeleteConfirmationModal = (value: boolean, data: any) => {
    deleteConfirmationModal.value = value
    if (value === false) {
      Object.assign(dataValue, initialFormData)
    } else {
      dataValue.value = data
    }
  }
  const deleteButtonRef = ref(null)

  const deleteData = async () => {
    const employeeId = dataValue.value?._id
    const response = await fetchWrapper.delete(`employee/${employeeId}`)
    toast.success(response.message)
    Object.assign(dataValue, initialFormData)
    setDeleteConfirmationModal(false, {})
    getData()
  }
</script>

<template>
  <div class="flex justify-between items-center mt-10 p-4 rounded-md bg-white">
    <h2 class="text-lg font-medium intro-y">List Karyawan</h2>
    <div
      class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
      <Button
        @click="modalPreview = true"
        variant="primary"
        class="mr-2 shadow-md">
        Tambah Karyawan
      </Button>
    </div>
  </div>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div
      class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
      <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
        <div class="relative w-56 text-slate-500">
          <FormInput
            v-model="params.keyword"
            type="text"
            class="w-56 pr-10 !box"
            placeholder="Search..." />
          <Lucide
            icon="Search"
            class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
        </div>
      </div>
    </div>
    <!-- BEGIN: Users Layout -->
    <div class="col-span-12 overflow-auto intro-y lg:overflow-visible">
      <TableEmployee
        :dataList="listData"
        :cols="cols"
        :meta="pagination"
        :params="params"
        :loading="loading"
        @update="getParams"
        @delete="(data: any) => {
          setDeleteConfirmationModal(true, data)
        }"
        @edit="(data: any) => {
          modalPreview = true
          isEdit = true
          dataValue = data.value
        }" />
    </div>
    <!-- BEGIN: Users Layout -->

    <DialogEmployee
      :modalPreview="modalPreview"
      :isEdit="isEdit"
      :data="dataValue"
      @close="closeDialog"
      @update="getData()" />

    <!-- BEGIN: Delete Confirmation Modal -->
    <Dialog
      :open="deleteConfirmationModal"
      @close="
        () => {
          setDeleteConfirmationModal(false, {})
        }
      "
      :initialFocus="deleteButtonRef">
      <Dialog.Panel>
        <div class="p-5 text-center">
          <Lucide icon="XCircle" class="w-16 h-16 mx-auto mt-3 text-danger" />
          <div class="mt-5 text-3xl">Are you sure?</div>
          <div class="mt-2 text-slate-500">
            Apakah anda yakin menghapus data ini?
          </div>
        </div>
        <div class="px-5 pb-8 text-center">
          <Button
            variant="outline-secondary"
            type="button"
            @click="
              () => {
                setDeleteConfirmationModal(false, {})
              }
            "
            class="w-24 mr-1">
            Tidak
          </Button>
          <Button
            @click="deleteData"
            variant="danger"
            type="button"
            class="w-24"
            ref="deleteButtonRef">
            Ya
          </Button>
        </div>
      </Dialog.Panel>
    </Dialog>
    <!-- END: Delete Confirmation Modal -->
  </div>
</template>
