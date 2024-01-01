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
  import TableEmployeeReport from "./TableEmployeeReport.vue"
  import { onMounted, reactive, ref } from "vue"
  import {
    IPaginate,
    IReportService,
    IReportEmployee,
    monthBase,
  } from "@/_helper/types-api"
  import fetchWrapper from "@/utils/axios/fetch-wrapper"

  //==== Get Data Start ====\\
  const listEmployeeReport = ref<IReportEmployee[]>([])
  const pagination = ref<IPaginate>()
  const loading: any = ref(true)
  const params = reactive({
    // type: "Bulanan",
    // page: 1,
    // limit: 20,
    // keyword: "",
    month: 11,
    year: 2023,
    // sort_column: "itemName",
    // sort_direction: "asc",
  })
  const cols =
    ref([
      { field: "employeeCode", title: "Kode", isUnique: true, sort: false },
      { field: "employeeName", title: "Nama Service" },
      { field: "employeeTaskUsed", title: "Jumlah Task (Selesai)" },
      { field: "incomeEarn", title: "Nominal Dihasilkan" },
    ]) || []

  const getData = async () => {
    try {
      loading.value = true

      const response = await fetchWrapper.get("report/employee", params)

      listEmployeeReport.value = response as IReportEmployee[]
    } catch {}

    loading.value = false
  }

  const getParams = (data: any) => {
    params.month = data.month
    params.year = data.year
    // params.sort_column = data.sort_column
    // params.sort_direction = data.sort_direction

    getData()
  }
  //==== Get Data End ====\\

  // ==== Filter ==== //
  const filterMonth = ref(null)
  const filterEvent = (data: any) => {
    const currentDate = data
    params.month = currentDate?.getMonth() + 1
    params.year = currentDate?.getFullYear()
    getParams(params)
  }
  const datePickerSize = ref("large")
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
    <h2 class="text-lg font-medium intro-y">Report Karyawan</h2>

    <div class="flex items-center gap-4 w-full mt-3 xl:w-auto xl:mt-0">
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
    </div>
  </div>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div class="col-span-12 sm:col-span-6 lg:col-span-12">
      <div class="p-5 mt-5 intro-y box">
        <TableEmployeeReport
          :dataList="listEmployeeReport"
          :cols="cols"
          :params="params"
          :meta="pagination"
          :loading="loading"
          @update="getParams" />
      </div>
    </div>
  </div>
</template>
