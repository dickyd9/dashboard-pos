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
      :height="'350px'"
      firstArrow="First"
      lastArrow="Last"
      previousArrow="Prev"
      nextArrow="Next"
      :showNumbersCount="3"
      class="alt-pagination"
      @change="changePagination"
      @rowClick="rowClick">
      <template #invoice="data">
        <div
          class="first:rounded-l-md last:rounded-r-md border-b-0 dark:bg-darkmode-600">
          <a href="" class="underline decoration-dotted whitespace-nowrap">
            {{ data.value.invoice }}
          </a>
        </div>
      </template>
      <template #totalPrice="data">
        <strong>Rp. {{ formatCurrency(data.value.totalPrice) }}</strong>
      </template>
      <template #paymentDate="data">
        <strong>{{
          formatDate(data.value.paymentDate, "DD MMMM YYYY")
        }}</strong>
      </template>
      <template #paymentStatus="data">
        <div v-if="data.value.paymentStatus === 'PAID'">
          <p class="text-success">Sukses</p>
        </div>
        <div v-if="data.value.paymentStatus === 'SELECTING_PAYMENT'">
          <p class="text-pending">Pilih Pembayaran</p>
        </div>
      </template>
    </vue3-datatable>
  </div>
</template>
<script setup lang="ts">
  import { formatCurrency, formatDate } from "@/utils/helper"
  import Button from "@/base-components/Button"
  import { onMounted, ref } from "vue"
  import { IService } from "@/_helper/types-api"
  import router from "@/router"

  const props = defineProps({
    dataList: Array,
    cols: Array,
    meta: Object,
    params: Object,
    loading: Boolean,
  })

  const emit = defineEmits<{
    (e: "update", value: any): void
  }>()
  const changePagination = (data: any) => {
    emit("update", data)
  }
  const modalPreview = ref(false)
  const itemData = ref<IService>()
  const assignTo = (data: any) => {
    modalPreview.value = true
    itemData.value = data
  }

  const rowClick = (data: any) => {
    router.push(`/transaction-detail/${data.paymentCode}`)
  }

  onMounted(() => {
    console.log(props.dataList)
  })
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
