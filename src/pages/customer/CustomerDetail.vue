<script setup lang="ts">
  import _ from "lodash"
  import fakerData from "@/utils/faker"
  import Button from "@/base-components/Button"
  import Lucide from "@/base-components/Lucide"
  import Tippy from "@/base-components/Tippy"
  import { Menu } from "@/base-components/Headless"
  import Table from "@/base-components/Table"
  import { FormInline, FormLabel, FormSelect } from "@/base-components/Form"
  import fetchWrapper from "@/utils/axios/fetch-wrapper"
  import { onMounted, reactive, ref } from "vue"
  import { useRoute } from "vue-router"
  import {
    ICustomerDetail,
    IPaginate,
    IReportTransactionDetail,
  } from "@/_helper/types-api"
  import { formatDate, formatCurrency } from "@/utils/helper"
  import { Search } from "@element-plus/icons-vue"
  import TableOrderDetail from "./components/TableOrderDetail.vue"

  const route = useRoute()

  const pagination = ref<IPaginate>()
  const loading: any = ref(true)
  const date = new Date()
  const params = reactive({
    // type: "Bulanan",
    month: date.getUTCMonth() + 1,
    year: date.getUTCFullYear(),
    keyword: "",
    page: 1,
    limit: 20,
    sort_column: "id",
    sort_direction: "asc",
  })

  const customerCode = route?.params?.code
  const customerDetail = ref<ICustomerDetail>()
  const getData = async () => {
    try {
      loading.value = true
      const response = await fetchWrapper.get(`customer/${customerCode}`)

      customerDetail.value = response as ICustomerDetail
      pagination.value = response.meta as IPaginate
    } catch {}
    loading.value = false
  }
  const cols =
    ref([
      { field: "itemCode", title: "Kode", isUnique: true, sort: false },
      { field: "itemName", title: "Jumlah Item" },
      { field: "itemPrice", title: "Total Harga", type: "price" },
      { field: "itemPoint", title: "Total Poin" },
    ]) || []

  // Filter Data
  const datePickerSize = ref("large")
  const filterDate = (value: any) => {
    const currentDate = value
    // params.date = currentDate?.getDate()
    params.month = currentDate?.getMonth() + 1
    params.year = currentDate?.getYear()
  }

  const getParams = (data: any) => {
    params.keyword = data.keyword
    params.page = data.current_page
    params.limit = data.pagesize
    params.year = data.year
    params.month = data.month
    params.sort_column = data.sort_column
    params.sort_direction = data.sort_direction

    getData()
  }

  onMounted(() => {
    setTimeout(() => {
      getData()
    }, 20)
  })
</script>

<template>
  <div class="flex flex-col items-center mt-8 intro-y sm:flex-row">
    <h2 class="mr-auto text-lg font-medium">Riwayat Transaksi Pelanggan</h2>
  </div>
  <!-- BEGIN: Transaction Details -->
  <div class="grid grid-cols-11 gap-5 mt-5 intro-y">
    <div class="col-span-12 lg:col-span-4 2xl:col-span-3">
      <div class="p-5 rounded-md box">
        <div
          class="flex items-center pb-5 mb-5 border-b border-slate-200/60 dark:border-darkmode-400">
          <div class="text-base font-medium truncate">Detail Pelanggan</div>
        </div>
        <div class="flex items-center">
          <Lucide icon="Clipboard" class="w-4 h-4 mr-2 text-slate-500" />
          Nama Pelanggan:
          <a href="" class="ml-1 underline decoration-dotted">
            {{ customerDetail?.customerName }}
          </a>
        </div>
        <div class="flex items-center mt-3">
          <Lucide icon="Calendar" class="w-4 h-4 mr-2 text-slate-500" />
          Nomor Telpon: {{ customerDetail?.customerContact }}
        </div>
        <div class="flex items-center mt-3">
          <Lucide icon="MapPin" class="w-4 h-4 mr-2 text-slate-500" />
          Alamat: {{ customerDetail?.customerAddress }}
        </div>
      </div>

      <div class="p-5 mt-5 rounded-md box">
        <div
          class="flex items-center pb-5 mb-5 border-b border-slate-200/60 dark:border-darkmode-400">
          <div class="text-base font-medium truncate">Detail Transaksi</div>
        </div>
        <div class="flex items-center mb-4">
          <Lucide icon="Clipboard" class="w-4 h-4 mr-2 text-slate-500" />
          Jumlah Transaksi:
          <a href="" class="ml-1">
            {{ customerDetail?.report?.totalTransaction }}
          </a>
        </div>
        <div class="flex items-center mb-4">
          <Lucide icon="Clipboard" class="w-4 h-4 mr-2 text-slate-500" />
          Nominal Transaksi:
          <a href="" class="ml-1">
            Rp.
            {{
              customerDetail?.report?.totalPaid
                ? formatCurrency(customerDetail?.report?.totalPaid)
                : 0
            }}
          </a>
        </div>
        <div class="flex items-center mb-4">
          <Lucide icon="Clipboard" class="w-4 h-4 mr-2 text-slate-500" />
          Jumlah Point:
          <a href="" class="ml-1">
            {{ customerDetail?.report?.totalPoint }}
          </a>
        </div>
        <div class="flex items-center mb-4">
          <Lucide icon="Clipboard" class="w-4 h-4 mr-2 text-slate-500" />
          Jumlah Item:
          <a href="" class="ml-1">
            {{ customerDetail?.report?.totalItem }}
          </a>
        </div>
      </div>
    </div>
    <div class="col-span-12 lg:col-span-7 2xl:col-span-8">
      <div class="p-5 rounded-md box">
        <div
          class="flex items-center pb-5 mb-5 border-b border-slate-200/60 dark:border-darkmode-400">
          <div class="text-base font-medium truncate">Riwayat Transaksi</div>
          <div class="flex gap-4">
            <FormInline>
              <FormLabel htmlFor="horizontal-form-1" class="sm:w-20">
                Pilih Bulan
              </FormLabel>

              <el-date-picker
                v-model="date"
                @change="filterDate"
                type="month"
                placeholder="Pilih Tanggal"
                :size="datePickerSize" />
            </FormInline>
          </div>
        </div>
        <div class="-mt-3 overflow-auto lg:overflow-visible">
          <TableOrderDetail
            :dataList="customerDetail?.report.transaction"
            :cols="cols"
            :meta="pagination"
            :params="params"
            :loading="loading"
            @update="getParams" />
        </div>
      </div>
    </div>
  </div>
  <!-- END: Transaction Details -->
</template>
