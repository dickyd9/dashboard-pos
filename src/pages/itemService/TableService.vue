<template>
  <div class="sticky-table">
    <vue3-datatable
      :rows="props.dataList"
      :columns="props.cols"
      :loading="props.loading"
      :totalRows="props.meta?.totalItems"
      :isServerMode="true"
      :pageSize="props.params?.pagesize"
      :sortable="true"
      :sortColumn="props.params?.sort_column"
      :sortDirection="props.params?.sort_direction"
      :stickyFirstColumn="true"
      :search="props.params?.keyword"
      :stickyHeader="true"
      :height="'400px'"
      firstArrow="First"
      lastArrow="Last"
      previousArrow="Prev"
      nextArrow="Next"
      :showNumbersCount="3"
      class="alt-pagination"
      @change="changePagination">
      <template #servicesCode="data">
        <div
          class="first:rounded-l-md last:rounded-r-md border-b-0 dark:bg-darkmode-600">
          <a href="" class="underline decoration-dotted whitespace-nowrap">
            {{ data.value.servicesCode }}
          </a>
        </div>
      </template>
      <template #servicesPrice="data">
        <strong>Rp. {{ formatCurrency(data.value.servicesPrice) }}</strong>
      </template>
      <template #createdAt="data">
        <strong>{{ formatDate(data.value.createdAt, "DD-MM-YYYY") }}</strong>
      </template>
      <template #actions="data">
        <div class="flex items-center gap-4">
          <Button
            @click.stop="assignTo(data.value)"
            variant="primary"
            type="submit">
            Assign
          </Button>
          <Button
            @click.stop="editData(data)"
            variant="success"
            class="text-white"
            type="submit">
            Edit
          </Button>
          <Button
            @click.stop="deleteData(data.value)"
            variant="danger"
            type="submit">
            Hapus
          </Button>
        </div>
      </template>
    </vue3-datatable>

    <DialogAssign
      :item="itemData"
      :modalPreview="modalPreview"
      @changeCategory="changeCategory"
      @close="modalPreview = false" />
  </div>
</template>
<script setup lang="ts">
  import { formatCurrency, formatDate } from "@/utils/helper"
  import Button from "@/base-components/Button"
  import { ref } from "vue"
  import DialogAssign from "./DialogAssign.vue"
  import { IService } from "@/_helper/types-api"

  const props = defineProps({
    dataList: Array,
    cols: Array,
    meta: Object,
    params: Object,
    loading: Boolean,
  })
  const emit = defineEmits<{
    (e: "update", value: any): void
    (e: "edit", value: any): void
    (e: "changeCategory"): void
    (e: "delete", value: any): void
  }>()

  const changeCategory = () => {
    emit("changeCategory")
  }

  const changePagination = (data: any) => {
    emit("update", data)
  }

  const editData = (data: any) => {
    emit("edit", data)
  }

  const deleteData = (data: any) => {
    emit("delete", data)
  }

  const modalPreview = ref(false)
  const itemData = ref<IService>()
  const assignTo = (data: any) => {
    modalPreview.value = true
    itemData.value = data
  }
</script>
<style>
  .sticky-table .bh-table-responsive table thead tr th {
    @apply whitespace-nowrap;
  }
  .sticky-table .bh-table-responsive table tbody tr td {
    @apply lg:whitespace-nowrap;
  }

  /* alt-pagination */
  .alt-pagination .bh-pagination .bh-page-item {
    @apply !w-max min-w-[32px] !rounded;
  }

  /* next-prev-pagination */
  .next-prev-pagination .bh-pagination .bh-page-item {
    @apply !w-max min-w-[100px] !rounded;
  }
  .next-prev-pagination .bh-pagination > div:first-child {
    @apply flex-col font-semibold;
  }
  .next-prev-pagination .bh-pagination .bh-pagination-number {
    @apply mx-auto gap-3;
  }
</style>
