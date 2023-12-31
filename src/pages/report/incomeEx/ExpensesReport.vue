<script setup lang="ts">
  import _ from "lodash"
  import { ref, reactive, onMounted } from "vue"
  import fakerData from "@/utils/faker"
  import Button from "@/base-components/Button"
  import Pagination from "@/base-components/Pagination"
  import { FormCheck, FormInput, FormSelect } from "@/base-components/Form"
  import Lucide from "@/base-components/Lucide"
  import { Dialog, Menu } from "@/base-components/Headless"
  import Table from "@/base-components/Table"
  import ReportPieChart from "@/components/ReportPieChart"
  import { IPaginate } from "@/_helper/types-api"
  import fetchWrapper from "@/utils/axios/fetch-wrapper"
  import TableTransaction from "./TableExpenses.vue"
  import DialogExpenses from "./DialogExpenses.vue"

  const deleteConfirmationModal = ref(false)
  const setDeleteConfirmationModal = (value: boolean) => {
    deleteConfirmationModal.value = value
  }
  const deleteButtonRef = ref(null)

  const openFilter = ref(false)

  //==== Get Data Start ====\\
  const listExpenses = ref([])
  const pagination = ref<IPaginate>()
  const loading: any = ref(true)
  const params = reactive({
    month: null,
    year: null,
    page: 1,
    limit: 20,
    sort_column: "id",
    sort_direction: "asc",
  })
  const cols =
    ref([
      { field: "description", title: "Keterangan", sort: false },
      { field: "amount", title: "Jumlah" },
      { field: "price", title: "Harga" },
      { field: "note", title: "Note", sort: false },
      { field: "createdAt", title: "Tanggal", type: "dateTime" },
    ]) || []

  const getData = async () => {
    try {
      loading.value = true

      const response = await fetchWrapper.get("report/expenses", params)

      listExpenses.value = response.data
      pagination.value = response.meta as IPaginate
    } catch {}

    loading.value = false
  }

  const getParams = (data: any) => {
    params.page = data.current_page
    params.limit = data.pagesize
    params.sort_column = data.sort_column
    params.sort_direction = data.sort_direction

    getData()
  }
  //==== Get Data End ====\\

  const dialogExpenses = ref(false)
  const setDialogExpenses = (value: boolean) => {
    dialogExpenses.value = value
  }

  onMounted(() => {
    setTimeout(() => {
      getData()
    }, 20)
  })
</script>

<template>
  <div
    class="flex justify-between items-center mt-10 p-4 rounded-md intro-y bg-white">
    <h2 class="text-lg font-medium intro-y">List Pengeluaran</h2>

    <div class="flex items-center w-full mt-3 xl:w-auto xl:mt-0">
      <Button
        @click="setDialogExpenses(true)"
        variant="primary"
        class="mr-2 shadow-md">
        <Lucide icon="Pencil" class="w-4 h-4 mr-2" /> Input Pengeluaran
      </Button>
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
    <!-- BEGIN: Transaction Table -->
    <div class="col-span-12 sm:col-span-12 lg:col-span-12">
      <div class="p-5 mt-5 intro-y box">
        <TableTransaction
          :dataList="listExpenses"
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
  <!-- START: Expenses Modal -->
  <DialogExpenses
    :modalPreview="dialogExpenses"
    @close="setDialogExpenses"
    @update="getData()" />
  <!-- END: Expenses Modal -->
</template>
