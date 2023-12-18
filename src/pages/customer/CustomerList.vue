<script setup lang="ts">
  import _ from "lodash"
  import fakerData from "@/utils/faker"
  import Button from "@/base-components/Button"
  import Pagination from "@/base-components/Pagination"
  import { FormInput, FormSelect } from "@/base-components/Form"
  import Lucide from "@/base-components/Lucide"
  import Table from "@/base-components/Table"
  import { Dialog, Menu } from "@/base-components/Headless"
  import TableCustomer from "./components/TableCustomer.vue"
  import { ref, reactive, onMounted } from "vue"
  import { ICustomer, ICustomerInput, IPaginate } from "@/_helper/types-api"
  import fetchWrapper from "@/utils/axios/fetch-wrapper"
  import { toast } from "vue3-toastify"
  import DialogCustomer from "./components/DialogCustomer.vue"
  import { Search } from "@element-plus/icons-vue"

  //==== Get Data Start ====\\
  const listData = ref<ICustomer[]>([])
  const pagination = ref<IPaginate>()
  const loading: any = ref(true)
  const params = reactive({
    keyword: null,
    current_page: 1,
    pagesize: 20,
    sort_column: "id",
    sort_direction: "asc",
  })
  const cols =
    ref([
      { field: "customerCode", title: "Kode", isUnique: true, sort: false },
      { field: "customerName", title: "Nama Customer" },
      { field: "totalPoints", title: "Point Customer", sort: false },
      {
        field: "customerDOB",
        title: "Tanggal Lahir",
        type: "dateTime",
        sort: false,
      },
      { field: "customerAddress", title: "Alamat Customer", sort: false },
      { field: "customerEmail", title: "Email Customer", sort: false },
      { field: "customerGender", title: "Gender", sort: false },
      { field: "customerContact", title: "No. Telpon", sort: false },
      { field: "createdAt", title: "Tanggal Dibuat", type: "dateTime" },
      { field: "actions", title: "Actions", sort: false },
    ]) || []

  const getData = async () => {
    try {
      loading.value = true

      const response = await fetchWrapper.get("customer", params)

      listData.value = response?.data as ICustomer[]
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

  // Dialog Start
  const dialog = ref(false)
  const isEdit = ref(false)
  const dataValue = ref<ICustomerInput>({
    _id: "",
    customerName: "",
    customerEmail: "",
    customerGender: "",
    customerAddress: "",
    customerContact: 0,
    customerDOB: new Date(),
    createdAt: new Date(),
  })

  const initialFormData = { ...dataValue }
  const editData = (data: any) => {
    dialog.value = true
    isEdit.value = true
    dataValue.value = data.value
  }
  const closeDialog = () => {
    dialog.value = false
    isEdit.value = false
    Object.assign(dataValue, initialFormData)
  }
  // Dialog End

  const deleteConfirmationModal = ref(false)
  const setDeleteConfirmationModal = (value: boolean) => {
    deleteConfirmationModal.value = value
  }
  const deleteButtonRef = ref(null)
  const deleteData = async () => {
    try {
      const customerId = dataValue.value._id
      const response = await fetchWrapper.delete(`customer/${customerId}`)
      toast.success(response.message)
      dialog.value = false
      Object.assign(dataValue, initialFormData)
    } catch (error: any) {
      toast.error(error.response?.message || error)
    }
  }

  const clearFilter = () => {
    params.keyword = null
    getData()
  }

  onMounted(() => {
    setTimeout(() => {
      getData()
    }, 20)
  })
  //==== Get Data End ====\\
</script>

<template>
  <div class="flex justify-between items-center mt-10 p-4 rounded-md bg-white">
    <h2 class="text-lg font-medium intro-y">List Customer</h2>
    <div class="flex flex-wrap items-center col-span-12 intro-y sm:flex-nowrap">
      <Button @click="dialog = true" variant="primary" class="mr-2 shadow-md">
        Add New Customer
      </Button>
    </div>
  </div>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div
      class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
      <div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
        <div class="relative w-56 text-slate-500">
          <div class="relative w-full text-slate-500">
            <el-input
              v-model="params.keyword"
              size="large"
              placeholder="Cari ..."
              :suffix-icon="Search"
              :style="{ borderRadius: `var(--el-border-radius-round)` }" />
          </div>
          <button
            v-if="params.keyword"
            @click="clearFilter"
            class="grow-0 text-center text-red-600 font-bold">
            Clear
          </button>
        </div>
      </div>
    </div>
    <!-- BEGIN: Users Layout -->
    <div class="col-span-12 overflow-auto intro-y lg:overflow-visible">
      <TableCustomer
        :dataList="listData"
        :cols="cols"
        :meta="pagination"
        :params="params"
        :loading="loading"
        @update="getParams"
        @edit="editData"
        @delete="(data: any) => {
          setDeleteConfirmationModal(true)
          dataValue = data
        }" />
    </div>
    <!-- BEGIN: Users Layout -->

    <!-- BEGIN: Dialog Customer -->
    <DialogCustomer
      :modalPreview="dialog"
      :is-edit="isEdit"
      :data="dataValue"
      @close="closeDialog"
      @update="
        () => {
          dialog = false
          getData()
        }
      " />
    <!-- END: Dialog Customer -->
    <!-- BEGIN: Delete Confirmation Modal -->
    <Dialog
      :open="deleteConfirmationModal"
      @close="
        () => {
          setDeleteConfirmationModal(false)
        }
      "
      :initialFocus="deleteButtonRef">
      <Dialog.Panel>
        <div class="p-5 text-center">
          <Lucide icon="XCircle" class="w-16 h-16 mx-auto mt-3 text-danger" />
          <div class="mt-5 text-3xl">Are you sure?</div>
          <div class="mt-2 text-slate-500">
            Apakah yakin ingin menghapus data?
          </div>
        </div>
        <div class="px-5 pb-8 text-center">
          <Button
            variant="outline-secondary"
            type="button"
            @click="
              () => {
                setDeleteConfirmationModal(false)
              }
            "
            class="w-24 mr-1">
            Cancel
          </Button>
          <Button
            @click="deleteData"
            variant="danger"
            type="button"
            class="w-24"
            ref="deleteButtonRef">
            Delete
          </Button>
        </div>
      </Dialog.Panel>
    </Dialog>
    <!-- END: Delete Confirmation Modal -->
  </div>
</template>
