<script setup lang="ts">
  import _ from "lodash"
  import { ref, reactive, onMounted } from "vue"
  import fakerData from "@/utils/faker"
  import Button from "@/base-components/Button"
  import Pagination from "@/base-components/Pagination"
  import {
    FormCheck,
    FormInput,
    FormSelect,
    FormInline,
    FormLabel,
  } from "@/base-components/Form"
  import Lucide from "@/base-components/Lucide"
  import { Dialog, Menu } from "@/base-components/Headless"
  import Table from "@/base-components/Table"
  import ReportPieChart from "@/components/ReportPieChart"
  import { IPaginate, IReportTransaction } from "@/_helper/types-api"
  import fetchWrapper from "@/utils/axios/fetch-wrapper"
  import TableTransaction from "./TableTransaction.vue"

  const deleteConfirmationModal = ref(false)
  const setDeleteConfirmationModal = (value: boolean) => {
    deleteConfirmationModal.value = value
  }
  const deleteButtonRef = ref(null)

  const openFilter = ref(false)

  //==== Get Data Start ====\\
  const listTransaction = ref<IReportTransaction[]>([])
  const pagination = ref<IPaginate>()
  const loading: any = ref(true)
  const date = new Date()
  const params = reactive({
    // type: "Bulanan",
    month: date.getUTCMonth() + 1,
    year: date.getUTCFullYear(),
    page: 1,
    limit: 20,
    // sort_column: "id",
    // sort_direction: "asc",
  })
  const cols =
    ref([
      { field: "invoice", title: "Invoice", isUnique: true, sort: false },
      { field: "customerName", title: "Nama Pelanggan" },
      { field: "totalAmount", title: "Jumlah Item" },
      { field: "totalPrice", title: "Jumlah Tagihan", type: "price" },
      { field: "paymentMethod", title: "Metode Pembayaran" },
      { field: "paymentStatus", title: "Status Pembayaran" },
      { field: "paymentDate", title: "Tanggal Transaksi", type: "dateTime" },
    ]) || []

  const getData = async () => {
    try {
      loading.value = true

      const response = await fetchWrapper.get("report/transaction", params)

      listTransaction.value = response.data as IReportTransaction[]
      pagination.value = response.meta as IPaginate
    } catch {}

    loading.value = false
  }

  const getParams = (data: any) => {
    params.page = data.current_page
    params.month = data.month
    params.year = data.year
    params.limit = data.pagesize
    // params.sort_column = data.sort_column
    // params.sort_direction = data.sort_direction

    getData()
  }
  //==== Get Data End ====\\

  // Print Excel
  const printTable = async () => {
    const data = {
      month: params.month,
      year: params.year,
    }
    const response = await fetchWrapper.get("report/transaction/export", data)

    window.open('localhost:3009/api/report/transaction/export?month=1&year=2024')
  }

  // Filter
  const filterMonth = ref(null)
  const filterEvent = (data: any) => {
    const currentDate = data
    params.month = currentDate?.getMonth() + 1
    params.year = currentDate?.getFullYear()
    getParams(params)
  }
  const datePickerSize = ref("large")

  onMounted(() => {
    setTimeout(() => {
      getData()
    }, 20)
  })
</script>

<template>
  <div
    class="flex justify-between items-center mt-10 p-4 rounded-md intro-y bg-white">
    <h2 class="text-lg font-medium intro-y">Transaction List</h2>

    <div class="flex items-center w-full mt-3 xl:w-auto xl:mt-0">
      <FormInline>
        <FormLabel htmlFor="horizontal-form-1" class="sm:w-20">
          Pilih Bulan
        </FormLabel>

        <el-date-picker
          v-model="filterMonth"
          @change="filterEvent"
          type="month"
          placeholder="Pilih Bulan"
          :size="datePickerSize" />
      </FormInline>
      <Button
        variant="primary"
        type="button"
        @click="
          () => {
            printTable()
          }
        "
        class="w-24 mr-1 ml-4">
        Print
      </Button>
    </div>
  </div>

  <div class="grid grid-cols-12 gap-6 mt-5">
    <!-- BEGIN: Transaction Table -->
    <div class="col-span-12 sm:col-span-6 lg:col-span-12">
      <div class="p-5 mt-5 intro-y box">
        <TableTransaction
          :dataList="listTransaction"
          :cols="cols"
          :meta="pagination"
          :params="params"
          :loading="loading"
          @update="getParams" />
      </div>
    </div>
    <!-- END: Weekly Transaction Table -->
  </div>
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
          Do you really want to delete these records? <br />
          This process cannot be undone.
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
</template>
