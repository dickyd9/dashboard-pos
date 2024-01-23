<script setup lang="ts">
  import _ from "lodash"
  import fakerData from "@/utils/faker"
  import Button from "@/base-components/Button"
  import Lucide from "@/base-components/Lucide"
  import Tippy from "@/base-components/Tippy"
  import { Menu } from "@/base-components/Headless"
  import Table from "@/base-components/Table"
  import fetchWrapper from "@/utils/axios/fetch-wrapper"
  import { onMounted, reactive, ref } from "vue"
  import { useRoute } from "vue-router"
  import { IPaginate, IReportTransactionDetail } from "@/_helper/types-api"
  import { formatDate, formatCurrency } from "@/utils/helper"

  const route = useRoute()
  const customerCode = route?.params?.code
  const transactionDetail = ref<IReportTransactionDetail>()
  const getData = async () => {
    try {
      const response = await fetchWrapper.get(`report/customer/${customerCode}`)

      console.log(response)
    } catch {}
  }

  const pagination = ref<IPaginate>()
  const loading: any = ref(true)
  const date = new Date()
  const params = reactive({
    // type: "Bulanan",
    // month: date.getUTCMonth() + 1,
    // year: date.getUTCFullYear(),
    page: 1,
    limit: 20,
    // sort_column: "id",
    // sort_direction: "asc",
  })
  const cols =
    ref([
      { field: "itemCode", title: "Kode", isUnique: true, sort: false },
      { field: "itemName", title: "Nama Item" },
      { field: "itemPoint", title: "Poin Item" },
      { field: "amount", title: "Jumlah Item", type: "price" },
      { field: "itemPrice", title: "Harga Item", type: "price" },
      { field: "totalPrice", title: "Total Harga", type: "price" },
      { field: "totalPoint", title: "Total Poin" },
    ]) || []

  const getParams = (data: any) => {
    params.page = data.current_page
    params.limit = data.pagesize
    // params.year = data.year
    // params.month = data.month
    // params.sort_column = data.sort_column
    // params.sort_direction = data.sort_direction

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
          Name:
          <a href="" class="ml-1 underline decoration-dotted">
            {{ fakerData[0].users[0].name }}
          </a>
        </div>
        <div class="flex items-center mt-3">
          <Lucide icon="Calendar" class="w-4 h-4 mr-2 text-slate-500" />
          Phone Number: +71828273732
        </div>
        <div class="flex items-center mt-3">
          <Lucide icon="MapPin" class="w-4 h-4 mr-2 text-slate-500" />
          Address: 260 W. Storm Street New York, NY 10025.
        </div>
      </div>
    </div>
    <div class="col-span-12 lg:col-span-7 2xl:col-span-8">
      <div class="p-5 rounded-md box">
        <div
          class="flex items-center pb-5 mb-5 border-b border-slate-200/60 dark:border-darkmode-400">
          <div class="text-base font-medium truncate">Riwayat Transaksi</div>
        </div>
        <div class="-mt-3 overflow-auto lg:overflow-visible">
          <!-- <TableOrderDetail
            :dataList="transactionDetail?.item"
            :cols="cols"
            :meta="pagination"
            :params="params"
            :loading="loading"
            @update="getParams" /> -->
        </div>
      </div>
    </div>
  </div>
  <!-- END: Transaction Details -->
</template>
