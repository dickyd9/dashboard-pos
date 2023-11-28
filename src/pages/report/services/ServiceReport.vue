<script setup lang="ts">
  import _ from "lodash"
  import fakerData from "@/utils/faker"
  import Button from "@/base-components/Button"
  import Pagination from "@/base-components/Pagination"
  import {
    FormInput,
    FormSelect,
    FormInline,
    FormLabel,
  } from "@/base-components/Form"
  import Lucide from "@/base-components/Lucide"
  import { Menu } from "@/base-components/Headless"
  import TableServiceReport from "./TableServiceReport.vue"
  import { onMounted, reactive, ref } from "vue"
  import { IPaginate, IReportService, monthBase } from "@/_helper/types-api"
  import fetchWrapper from "@/utils/axios/fetch-wrapper"

  //==== Get Data Start ====\\
  const listServiceReport = ref<IReportService[]>([])
  const pagination = ref<IPaginate>()
  const loading: any = ref(true)
  const params = reactive({
    // type: "Bulanan",
    // page: 1,
    // limit: 20,
    keyword: "",
    month: 11,
    year: 2023,
    sort_column: "itemName",
    sort_direction: "asc",
  })
  const cols =
    ref([
      { field: "itemCode", title: "Kode", isUnique: true, sort: false },
      { field: "itemName", title: "Nama Service" },
      { field: "amountUsed", title: "Jumlah Item (Pada Transaksi)" },
      {
        field: "pointUsed",
        title: "Jumlah Point (Pada Transaksi)",
        type: "price",
      },
      {
        field: "totalPrice",
        title: "Jumlah Harga (Pada Transaksi)",
        type: "price",
      },
    ]) || []

  const getData = async () => {
    try {
      loading.value = true

      const response = await fetchWrapper.get("report/service", params)

      listServiceReport.value = response as IReportService[]
    } catch {}

    loading.value = false
  }

  const getParams = (data: any) => {
    // params.page = data.current_page
    // params.limit = data.pagesize
    params.month = data.month
    params.year = data.year
    params.sort_column = data.sort_column
    params.sort_direction = data.sort_direction

    getData()
  }
  //==== Get Data End ====\\

  // ==== Filter ==== //
  const month = monthBase
  const year = [2023]

  onMounted(() => {
    setTimeout(() => {
      getData()
    }, 20)
  })
</script>

<template>
  <div
    class="flex justify-between items-center mt-10 p-4 rounded-md intro-y bg-white">
    <h2 class="text-lg font-medium intro-y">Service Report</h2>

    <div class="flex items-center gap-4 w-full mt-3 xl:w-auto xl:mt-0">
      <FormInline>
        <FormSelect
          @update:modelValue="(value: any) => {
            params.month = value
            getParams(params)
        }"
          class="w-full mt-3 !box sm:mt-0">
          <option
            v-for="(months, index) in month"
            :key="index"
            :value="months.month">
            {{ months.name }}
          </option>
        </FormSelect>
      </FormInline>

      <FormInline>
        <FormSelect
          @update:modelValue="(value: any) => {
          params.year = value
          getParams(params)
      }"
          class="w-full mt-3 !box sm:mt-0">
          <option v-for="(yr, index) in year" :key="index" :value="yr">
            {{ yr }}
          </option>
        </FormSelect>
      </FormInline>
      <!-- <Button variant="primary" class="mr-2 shadow-md">
        <Lucide icon="FileText" class="w-4 h-4 mr-2" /> Export to Excel
      </Button>
      <Button variant="primary" class="mr-2 shadow-md">
        <Lucide icon="FileText" class="w-4 h-4 mr-2" /> Export to PDF
      </Button>
      <Menu>
        <Menu.Button :as="Button" class="px-2 !box">
          <span class="flex items-center justify-center w-5 h-5">
            <Lucide icon="Plus" class="w-4 h-4" />
          </span>
        </Menu.Button>
        <Menu.Items class="w-40">
          <Menu.Item>
            <Lucide icon="Printer" class="w-4 h-4 mr-2" /> Print
          </Menu.Item>
          <Menu.Item>
            <Lucide icon="FileText" class="w-4 h-4 mr-2" /> Export to Excel
          </Menu.Item>
          <Menu.Item>
            <Lucide icon="FileText" class="w-4 h-4 mr-2" /> Export to PDF
          </Menu.Item>
        </Menu.Items>
      </Menu> -->
    </div>
  </div>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="col-span-12 sm:col-span-6 lg:col-span-12">
      <div class="p-5 mt-5 intro-y box">
        <TableServiceReport
          :dataList="listServiceReport"
          :cols="cols"
          :params="params"
          :meta="pagination"
          :loading="loading"
          @update="getParams" />
      </div>
    </div>
  </div>
</template>
