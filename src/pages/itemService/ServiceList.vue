<script setup lang="ts">
  import _ from "lodash"
  import { onMounted, reactive, ref } from "vue"
  import fakerData from "@/utils/faker"
  import Button from "@/base-components/Button"
  import Pagination from "@/base-components/Pagination"
  import { FormInput, FormSelect } from "@/base-components/Form"
  import Lucide from "@/base-components/Lucide"
  import Tippy from "@/base-components/Tippy"
  import { Dialog, Menu } from "@/base-components/Headless"
  import Table from "@/base-components/Table"
  import { formatCurrency } from "@/utils/helper"
  import { IPaginate, IService, IServiceInput } from "@/_helper/types-api"
  import { useServiceStore } from "@/stores/api/service-store"
  import { useAuthStore } from "@/stores/api/auth-store"
  import fetchWrapper from "@/utils/axios/fetch-wrapper"
  import TableService from "./TableService.vue"
  import DialogService from "./DialogService.vue"
  import DialogAssignCategory from "./DialogAssignCategory.vue"
  import { toast } from "vue3-toastify"
  import { Search } from "@element-plus/icons-vue"

  //==== Get Data Start ====\\
  const listService = ref<IService[]>([])
  const pagination = ref<IPaginate>()
  const loading: any = ref(true)
  const params = reactive({
    type: "services",
    category: null,
    keyword: null,
    page: 1,
    limit: 20,
    sort_column: null,
    sort_direction: "asc",
  })
  const cols =
    ref([
      { field: "itemCode", title: "Kode", isUnique: true, sort: false },
      { field: "itemName", title: "Nama Service" },
      { field: "itemPrice", title: "Harga", type: "price" },
      { field: "categoryName", title: "Category" },
      { field: "itemPoint", title: "Point", type: "number" },
      { field: "itemStatus", title: "Status", sort: false },
      { field: "createdAt", title: "Tanggal Dibuat", type: "dateTime" },
      { field: "actions", title: "Actions", sort: false },
    ]) || []

  const getData = async () => {
    try {
      loading.value = true

      const response = await fetchWrapper.get("item", params)

      listService.value = response?.data as IService[]
      pagination.value = response.meta as IPaginate
    } catch {}

    loading.value = false
  }

  const getParams = (data: any) => {
    params.category = data.category
    params.page = data.current_page
    params.limit = data.pagesize
    params.sort_column = data.sort_column
    params.sort_direction = data.sort_direction

    getData()
  }
  //==== Get Data End ====\\

  // Dialog Start
  const dialog = ref(false)
  const modalPreview = ref(false)
  const modalAssign = ref(false)
  // Dialog End

  const dataEdit = ref<IServiceInput>({
    _id: "",
    itemName: "",
    itemCategory: null,
    itemPrice: 0,
    itemPoint: 0,
    itemStatus: "",
    createdAt: new Date(),
  })

  const initialFormData = { ...dataEdit }

  const closeDialog = () => {
    Object.assign(dataEdit, initialFormData)
  }

  const isEdit = ref(false)
  const editData = (data: any) => {
    dialog.value = true
    isEdit.value = true
    dataEdit.value = data.value
  }

  // Categories
  interface categories {
    _id: string
    categoryName: string
  }

  const categories = ref<categories[]>([])
  const getCategories = async () => {
    const response = await fetchWrapper.get(`master/category`)
    categories.value = response?.data as categories[]
  }

  const clearFilter = () => {
    ;(params.category = null), (params.keyword = null)
    getData()
  }

  onMounted(() => {
    setTimeout(() => {
      getData()
      getCategories()
    }, 20)
  })

  const deleteConfirmationModal = ref(false)
  const setDeleteConfirmationModal = (value: boolean, data: any) => {
    deleteConfirmationModal.value = value
    if (value === false) {
      Object.assign(dataEdit, initialFormData)
    } else {
      dataEdit.value = data
    }
  }
  const deleteButtonRef = ref(null)

  const deleteData = async () => {
    const servicesId = dataEdit.value?._id
    const response = await fetchWrapper.delete(`item/${servicesId}`)
    toast.success(response.message)
    Object.assign(editData, initialFormData)
    setDeleteConfirmationModal(false, {})
    getData()
  }
</script>

<template>
  <div class="flex justify-between items-center mt-10 p-4 rounded-md bg-white">
    <h2 class="text-lg font-medium intro-y">Service List</h2>
    <div
      class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
      <Button @click="dialog = true" variant="primary" class="mr-2 shadow-md">
        Add New Service
      </Button>
      <Button
        @click="modalAssign = true"
        variant="success"
        class="mr-2 text-white shadow-md">
        Assign Category
      </Button>
    </div>
  </div>
  <div class="grid grid-cols-12 gap-6 mt-5">
    <div
      class="flex justify-between flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
      <div class="w-full flex gap-4 mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
        <div class="grow w-full text-slate-500">
          <el-input
            v-model="params.keyword"
            size="large"
            placeholder="Cari ..."
            :suffix-icon="Search"
            :style="{ borderRadius: `var(--el-border-radius-round)` }" />
        </div>
        <div class="grow w-full text-slate-500">
          <el-select
            v-model="params.category"
            style="border-radius: 20px"
            @change="(value: any) => {
              getData()
            }"
            placeholder="Pilih Category"
            size="large">
            <el-option
              v-for="item in categories"
              :key="item.categoryName"
              :label="item.categoryName"
              :value="item._id"
              :disabled="item.categoryName === params.category" />
          </el-select>
        </div>
        <button
          v-if="params.category || params.keyword"
          @click="clearFilter"
          class="grow-0 text-center text-red-600 font-bold">
          Clear
        </button>
      </div>
    </div>
    <!-- BEGIN: Data List -->
    <div class="col-span-12 overflow-auto intro-y lg:overflow-visible">
      <TableService
        :dataList="listService"
        :cols="cols"
        :meta="pagination"
        :params="params"
        :loading="loading"
        @changeCategory="getData"
        @update="getParams"
        @edit="(data: any) => {
          editData(data)
        }"
        @delete="(data: any) => {
          setDeleteConfirmationModal(true, data)
        }" />
    </div>
    <!-- END: Data List -->
  </div>
  <!-- BEGIN: Dialog Add Data -->
  <DialogService
    :modalPreview="dialog"
    :is-edit="isEdit"
    :data="dataEdit"
    @close="
      () => {
        isEdit = false
        dialog = false
        closeDialog()
      }
    "
    @update="
      () => {
        dialog = false
        getData()
      }
    " />
  <!-- END: Dialog Add Data -->

  <!-- BEGIN: Dialog Add Data -->
  <DialogAssignCategory
    :modalPreview="modalAssign"
    @changeCategory="getData"
    @close="modalAssign = false" />
  <!-- END: Dialog Add Data -->

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
</template>
