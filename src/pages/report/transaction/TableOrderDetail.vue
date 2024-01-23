<template>
  <div class="sticky-table">
    <vue3-datatable
      :rows="props.dataList"
      :columns="props.cols"
      :stickyFirstColumn="true"
      :stickyHeader="true"
      :height="'400px'"
      @rowClick="rowClick">
      <template #itemCode="data">
        <div
          class="first:rounded-l-md last:rounded-r-md border-b-0 dark:bg-darkmode-600">
          <a href="" class="underline decoration-dotted whitespace-nowrap">
            {{ data.value.itemCode }}
          </a>
        </div>
      </template>
      <template #itemPrice="data">
        <strong>Rp. {{ formatCurrency(data.value.itemPrice) }}</strong>
      </template>
      <template #totalPrice="data">
        <strong
          >Rp.
          {{ formatCurrency(data.value.itemPrice * data.value.amount) }}</strong
        >
      </template>
      <template #totalPoint="data">
        <div>{{ data.value.itemPoint * data.value.amount }}</div>
      </template>
      <template #createdAt="data">
        <strong>{{ formatDate(data.value.createdAt, "DD-MM-YYYY") }}</strong>
      </template>
      <!-- <template #actions="data">
        <div class="flex items-center gap-4">
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
      </template> -->
    </vue3-datatable>
  </div>
</template>
<script setup lang="ts">
  import { formatCurrency, formatDate } from "@/utils/helper"
  import Button from "@/base-components/Button"
  import { ref } from "vue"
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
    (e: "edit", value: any): void
    (e: "delete", value: any): void
  }>()

  const editData = (data: any) => {
    emit("edit", data)
  }

  const deleteData = (data: any) => {
    emit("delete", data)
  }

  const rowClick = (data: any) => {
    console.log(data)
    // router.push(`/serviceItem/${data.customerCode}`)
  }
</script>
