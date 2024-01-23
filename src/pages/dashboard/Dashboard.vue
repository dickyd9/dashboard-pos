<script setup lang="ts">
  import _ from "lodash"
  import { ref, provide, onMounted } from "vue"
  import fakerData from "@/utils/faker"
  import Button from "@/base-components/Button"
  import Pagination from "@/base-components/Pagination"
  import { FormInput, FormSelect } from "@/base-components/Form"
  import TinySlider, { TinySliderElement } from "@/base-components/TinySlider"
  import Lucide from "@/base-components/Lucide"
  import Tippy from "@/base-components/Tippy"
  import Litepicker from "@/base-components/Litepicker"
  import ReportDonutChart from "@/components/ReportDonutChart"
  import ReportLineChart from "@/components/ReportLineChart"
  import ReportPieChart from "@/components/ReportPieChart"
  import ReportDonutChart1 from "@/components/ReportDonutChart1"
  import SimpleLineChart1 from "@/components/SimpleLineChart1"
  import LeafletMap from "@/components/LeafletMap"
  import { Menu } from "@/base-components/Headless"
  import Table from "@/base-components/Table"
  import fetchWrapper from "@/utils/axios/fetch-wrapper"
  import {
    ILastTransaction,
    IReportIncome,
    IReportPayment,
  } from "@/_helper/types-api"
  import { formatCurrency, formatDate } from "@/utils/helper"
  import { start } from "repl"
  import router from "@/router"

  const salesReportFilter = ref<string>("")
  const importantNotesRef = ref<TinySliderElement>()

  provide("bind[importantNotesRef]", (el: TinySliderElement) => {
    importantNotesRef.value = el
  })

  const prevImportantNotes = () => {
    importantNotesRef.value?.tns.goTo("prev")
  }
  const nextImportantNotes = () => {
    importantNotesRef.value?.tns.goTo("next")
  }

  // General Report
  interface IGeneralReport {
    icon: string
    title: string
    key: string
    data: number
    link: string
  }

  const generalReport = ref<IGeneralReport[]>([])
  const getGeneralReport = async () => {
    try {
      const response = await fetchWrapper.get("dashboard/general")
      generalReport.value = response as IGeneralReport[]
    } catch (error) {}
  }

  const actionGeneral = (action: any) => {
    // console.log(action)
    router.push(action)
  }

  // Income Report
  const incomeReport = ref<IReportIncome>()
  const paymentUsage = ref<IReportPayment>()
  const param = {
    month: 11,
    year: 2023,
    startDate: "" as Date | "",
    endDate: "" as Date | "",
  }
  const getIncomeReport = async () => {
    try {
      const response = await fetchWrapper.get("report/info", param)
      incomeReport.value = response?.data?.financialReport as IReportIncome
      paymentUsage.value = {
        DEBIT: response?.data?.paymentUsage.DEBIT || 0,
        CASH: response?.data?.paymentUsage.CASH || 0,
        TRANSFER: response?.data?.paymentUsage.TRANSFER || 0,
        OTHER:
          response?.data?.paymentUsage.undefined != null
            ? response?.data?.paymentUsage.undefined
            : 1,
      }
    } catch (error) {}
  }

  // Last Transaction
  const lastTransaction = ref<ILastTransaction[]>([])
  const getLastTransaction = async () => {
    try {
      const response = await fetchWrapper.get("dashboard/transactions")
      lastTransaction.value = response as ILastTransaction[]
    } catch (error) {}
  }

  // Filter Report
  const checkDate = async (value: any) => {
    const dateRange = value.split("-")
    const startDate = new Date(dateRange[0])
    const endDate = new Date(dateRange[1])
    // console.log(startDate, startEnd)
    param.startDate = startDate
    param.endDate = endDate

    await getIncomeReport()
  }

  // Best Employee
  interface IBestEmployee {
    employeeCode: string
    employeeName: string
    employeeTaskHandle: number
    incomeEarn: number
  }

  const bestEmployee = ref<IBestEmployee[]>([])
  const getBestEmployee = async () => {
    try {
      const response = await fetchWrapper.get("dashboard/employeeBest")
      bestEmployee.value = response as IBestEmployee[]
    } catch (error) {}
  }

  onMounted(async () => {
    await getGeneralReport()
    await getIncomeReport()
    await getLastTransaction()
    await getBestEmployee()
  })
</script>

<template>
  <div class="grid grid-cols-12 gap-6">
    <div class="col-span-12 2xl:col-span-12">
      <div class="grid grid-cols-12 gap-6">
        <!-- BEGIN: General Report -->
        <div class="col-span-12 mt-8">
          <div class="flex items-center h-10 intro-y">
            <h2 class="mr-5 text-lg font-medium truncate">General Report</h2>
            <a href="" class="flex items-center ml-auto text-primary">
              <Lucide icon="RefreshCcw" class="w-4 h-4 mr-3" /> Reload Data
            </a>
          </div>
          <div class="grid grid-cols-12 gap-6 mt-5">
            <div
              v-for="(general, index) in generalReport"
              :key="index"
              class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
              <div
                @click="
                  () => {
                    const route = general?.link
                    actionGeneral(route)
                  }
                "
                :class="[
                  'relative zoom-in',
                  'before:content-[\'\'] before:w-[90%] before:shadow-[0px_3px_5px_#0000000b] before:bg-white/60 before:h-full before:mt-2.5 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70',
                ]">
                <div class="p-5 box">
                  <div class="flex gap-4">
                    <Lucide
                      :icon="general?.icon"
                      class="w-[28px] h-[28px] text-primary" />
                    <div class="">
                      <div class="mt-1 text-base text-slate-500">
                        {{ general?.title }}
                      </div>
                      <!-- <Tippy
                        as="div"
                        class="cursor-pointer bg-success py-[3px] flex rounded-full text-white text-xs pl-2 pr-1 items-center font-medium"
                        content="33% Higher than last month">
                        33%
                        <Lucide icon="ChevronUp" class="w-4 h-4 ml-0.5" />
                      </Tippy> -->
                    </div>
                  </div>
                  <div class="mt-6 text-3xl font-medium leading-8">
                    {{ general?.data }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- END: General Report -->

        <!-- BEGIN: Sales Report -->
        <div class="col-span-12 mt-8 lg:col-span-12">
          <div class="items-center block h-10 intro-y sm:flex">
            <h2 class="mr-5 text-lg font-medium truncate">Report Keuangan</h2>
            <div class="relative mt-3 sm:ml-auto sm:mt-0 text-slate-500">
              <Lucide
                icon="Calendar"
                class="absolute inset-y-0 left-0 z-10 w-4 h-4 my-auto ml-3" />
              <Litepicker
                v-model="salesReportFilter"
                @update:modelValue="checkDate"
                :options="{
                  autoApply: false,
                  singleMode: false,
                  numberOfColumns: 2,
                  numberOfMonths: 2,
                  showWeekNumbers: true,
                  dropdowns: {
                    minYear: 1990,
                    maxYear: null,
                    months: true,
                    years: true,
                  },
                }"
                class="pl-10 sm:w-56 !box" />
            </div>
          </div>
        </div>
        <div class="col-span-12 lg:col-span-12">
          <div class="col-span-12 mt-5 lg:col-span-6">
            <div class="p-5 mt-12 intro-y box sm:mt-5">
              <div class="flex flex-col md:flex-row md:items-center">
                <div class="flex">
                  <div>
                    <div
                      class="text-lg font-medium text-primary dark:text-slate-300 xl:text-xl">
                      Rp.
                      {{
                        incomeReport?.totalIncome
                          ? formatCurrency(incomeReport?.totalIncome)
                          : 0
                      }}
                    </div>
                    <div class="mt-0.5 text-slate-500">Pemasukan</div>
                  </div>
                  <div
                    class="w-px h-12 mx-4 border border-r border-dashed border-slate-200 dark:border-darkmode-300 xl:mx-5"></div>
                  <div>
                    <div class="text-lg font-medium text-slate-500 xl:text-xl">
                      Rp.
                      {{
                        incomeReport?.totalExpense
                          ? formatCurrency(incomeReport?.totalExpense)
                          : 0
                      }}
                    </div>
                    <div class="mt-0.5 text-slate-500">Pengeluaran</div>
                  </div>
                  <div
                    class="w-px h-12 mx-4 border border-r border-dashed border-slate-200 dark:border-darkmode-300 xl:mx-5"></div>
                  <div>
                    <div
                      :class="
                        incomeReport?.summary
                          ? incomeReport?.summary < 0
                            ? 'text-red-500'
                            : 'text-green-500'
                          : ''
                      "
                      class="text-lg font-medium text-slate-500 xl:text-xl">
                      {{
                        incomeReport?.summary
                          ? incomeReport?.summary < 0
                            ? "- Rp. " + formatCurrency(incomeReport?.summary)
                            : "Rp. " + formatCurrency(incomeReport?.summary)
                          : "Rp. 0"
                      }}
                    </div>
                    <div class="mt-0.5 text-slate-500">Summary</div>
                  </div>
                </div>
              </div>
              <div :class="['relative']">
                <ReportLineChart
                  :dataIncome="incomeReport"
                  :height="275"
                  class="mt-6 -mb-6" />
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="col-span-12 lg:col-span-4">
          <div class="p-5 mt-5 intro-y box">
            <div class="mt-3">
              <ReportPieChart :paymentUsage="paymentUsage" :height="213" />
            </div>
            <div class="mx-auto mt-8 w-52 sm:w-auto">
              <div class="flex items-center">
                <div class="w-2 h-2 mr-3 rounded-full bg-primary"></div>
                <span class="truncate">Cash</span>
                <span class="ml-auto font-medium">{{
                  paymentUsage?.CASH
                }}</span>
              </div>
              <div class="flex items-center mt-4">
                <div class="w-2 h-2 mr-3 rounded-full bg-pending"></div>
                <span class="truncate">Debit</span>
                <span class="ml-auto font-medium">{{
                  paymentUsage?.DEBIT
                }}</span>
              </div>
              <div class="flex items-center mt-4">
                <div class="w-2 h-2 mr-3 rounded-full bg-warning"></div>
                <span class="truncate">Other</span>
                <span class="ml-auto font-medium">{{
                  paymentUsage?.OTHER
                }}</span>
              </div>
              <div class="flex items-center mt-4">
                <div class="w-2 h-2 mr-3 rounded-full bg-info"></div>
                <span class="truncate">Transfer</span>
                <span class="ml-auto font-medium">{{
                  paymentUsage?.TRANSFER
                }}</span>
              </div>
            </div>
          </div>
        </div> -->
        <!-- END: Sales Report -->
      </div>
    </div>
    <div class="col-span-12 2xl:col-span-3">
      <div class="pb-10 -mb-10 2xl:border-l">
        <div class="grid grid-cols-12 2xl:pl-6 gap-x-6 2xl:gap-x-0 gap-y-6">
          <!-- BEGIN: Transactions -->
          <div
            class="col-span-12 mt-3 md:col-span-6 xl:col-span-4 2xl:col-span-12 2xl:mt-8">
            <div class="flex items-center h-10 intro-x">
              <h2 class="mr-5 text-lg font-medium truncate">Transactions</h2>
            </div>
            <div class="mt-5">
              <div
                v-for="(trx, trxIndex) in lastTransaction"
                :key="trxIndex"
                class="intro-x">
                <div class="flex items-center pr-3 py-3 mb-3 box zoom-in">
                  <div class="ml-4 mr-auto">
                    <div class="font-medium">{{ trx.customerName }}</div>
                    <div class="text-slate-500 text-xs mt-0.5">
                      {{ formatDate(trx.paymentDate, "DD MMMM YYYY") }}
                    </div>
                  </div>
                  <div class="text-success">
                    {{ trx.totalPrice ? "+ Rp. " + formatCurrency(trx.totalPrice) : "Rp. 0"  }}
                  </div>
                </div>
              </div>
              <a
                href=""
                class="block w-full py-3 text-center border border-dotted rounded-md intro-x border-slate-400 dark:border-darkmode-300 text-slate-500">
                View More
              </a>
            </div>
          </div>
          <!-- END: Transactions -->
        </div>
      </div>
    </div>

    <div class="col-span-12 2xl:col-span-3">
      <div class="pb-10 -mb-10 2xl:border-l">
        <div class="grid grid-cols-12 2xl:pl-6 gap-x-6 2xl:gap-x-0 gap-y-6">
          <!-- BEGIN: Transactions -->
          <div
            class="col-span-12 mt-3 md:col-span-6 xl:col-span-4 2xl:col-span-12 2xl:mt-8">
            <div class="flex items-center h-10 intro-x">
              <h2 class="mr-5 text-lg font-medium truncate">Tugas Karyawan</h2>
            </div>
            <div class="mt-5">
              <div
                v-for="(task, taskIndex) in bestEmployee"
                :key="taskIndex"
                class="intro-x">
                <div class="flex items-center pr-3 py-3 mb-3 box zoom-in">
                  <div class="ml-4 mr-auto">
                    <div class="font-medium">{{ task.employeeName }}</div>
                    <div class="text-slate-500 text-xs mt-0.5">
                      {{ task.employeeCode }}
                    </div>
                  </div>
                  <div class="text-success">
                    {{ "+ Rp. " + formatCurrency(task.incomeEarn) }}
                  </div>
                </div>
              </div>
              <a
                href=""
                class="block w-full py-3 text-center border border-dotted rounded-md intro-x border-slate-400 dark:border-darkmode-300 text-slate-500">
                View More
              </a>
            </div>
          </div>
          <!-- END: Transactions -->
        </div>
      </div>
    </div>
  </div>
</template>
