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
  import TableOrderDetail from "./TableOrderDetail.vue"

  const route = useRoute()
  const paymentCode = route?.params?.code
  const transactionDetail = ref<IReportTransactionDetail>()
  const getData = async () => {
    try {
      const response = await fetchWrapper.get(
        `report/transaction/${paymentCode}`
      )

      transactionDetail.value = response as IReportTransactionDetail
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
    <h2 class="mr-auto text-lg font-medium">Transaction Details</h2>
    <!-- <div class="flex w-full mt-4 sm:w-auto sm:mt-0">
      <Button variant="primary" class="mr-2 shadow-md"> Print </Button>
      <Menu class="ml-auto sm:ml-0">
        <Menu.Button :as="Button" class="px-2 !box">
          <span class="flex items-center justify-center w-5 h-5">
            <Lucide icon="Plus" class="w-4 h-4" />
          </span>
        </Menu.Button>
        <Menu.Items class="w-40">
          <Menu.Item>
            <Lucide icon="File" class="w-4 h-4 mr-2" /> Export Word
          </Menu.Item>
          <Menu.Item>
            <Lucide icon="File" class="w-4 h-4 mr-2" /> Export to PDF
          </Menu.Item>
        </Menu.Items>
      </Menu>
    </div> -->
  </div>
  <!-- BEGIN: Transaction Details -->
  <div class="grid grid-cols-11 gap-5 mt-5 intro-y">
    <div class="col-span-12 lg:col-span-4 2xl:col-span-3">
      <div class="p-5 rounded-md box">
        <div
          class="flex items-center pb-5 mb-5 border-b border-slate-200/60 dark:border-darkmode-400">
          <div class="text-base font-medium truncate">Detail Transaksi</div>
        </div>
        <div class="flex items-center">
          <Lucide icon="Clipboard" class="w-4 h-4 mr-2 text-slate-500" />
          Invoice:
          <a href="" class="ml-1 underline decoration-dotted">
            {{ transactionDetail?.paymentDetail?.invoiceCode }}
          </a>
        </div>
        <div class="flex items-center mt-3">
          <Lucide icon="Calendar" class="w-4 h-4 mr-2 text-slate-500" />
          Tanggal Transaksi:
          {{
            formatDate(
              transactionDetail?.paymentDetail?.createdAt,
              "DD MMMM YYYY"
            )
          }}
        </div>
        <div class="flex items-center mt-3">
          <Lucide icon="Clock" class="w-4 h-4 mr-2 text-slate-500" />
          Transaction Status:
          <span
            :class="
              transactionDetail?.paymentDetail?.paymentStatus == 'PAID'
                ? 'bg-success/20 text-success'
                : 'bg-warning/20 text-warning'
            "
            class="px-2 ml-1 rounded">
            {{
              transactionDetail?.paymentDetail?.paymentStatus == "PAID"
                ? "Sukses"
                : "Menunggu"
            }}
          </span>
        </div>
      </div>
      <div class="p-5 mt-5 rounded-md box">
        <div
          class="flex items-center pb-5 mb-5 border-b border-slate-200/60 dark:border-darkmode-400">
          <div class="text-base font-medium truncate">Detail Pelanggan</div>
        </div>
        <div class="flex items-center">
          <Lucide icon="Clipboard" class="w-4 h-4 mr-2 text-slate-500" />
          Kode Pelanggan:
          <a href="" class="ml-1 underline decoration-dotted">
            {{
              transactionDetail?.customerDetail?.customerCode
                ? transactionDetail?.customerDetail?.customerCode
                : "-"
            }}
          </a>
        </div>
        <div class="flex items-center mt-3">
          <Lucide icon="Clipboard" class="w-4 h-4 mr-2 text-slate-500" />
          Nama Pelanggan:
          <a href="" class="ml-1 underline decoration-dotted">
            {{
              transactionDetail?.customerDetail?.customerName
                ? transactionDetail?.customerDetail?.customerName
                : "-"
            }}
          </a>
        </div>
        <div class="flex items-center mt-3">
          <Lucide icon="Calendar" class="w-4 h-4 mr-2 text-slate-500" />
          Nomor Telepon:
          {{
            transactionDetail?.customerDetail?.customerNumber
              ? transactionDetail?.customerDetail?.customerNumber
              : "-"
          }}
        </div>
        <div class="flex items-center mt-3">
          <Lucide icon="MapPin" class="w-4 h-4 mr-2 text-slate-500" />
          Alamat:
          {{
            transactionDetail?.customerDetail?.customerAddress
              ? transactionDetail?.customerDetail?.customerAddress
              : "-"
          }}
        </div>
      </div>
      <div class="p-5 mt-5 rounded-md box">
        <div
          class="flex items-center pb-5 mb-5 border-b border-slate-200/60 dark:border-darkmode-400">
          <div class="text-base font-medium truncate">Detail Pembayaran</div>
        </div>
        <div class="flex items-center">
          <Lucide icon="Clipboard" class="w-4 h-4 mr-2 text-slate-500" />
          Metode Pembayaran:
          <div class="ml-auto">
            {{ transactionDetail?.paymentDetail?.paymentMethod }}
          </div>
        </div>
        <div class="flex items-center mt-3">
          <Lucide icon="CreditCard" class="w-4 h-4 mr-2 text-slate-500" />
          Total Harga ({{ transactionDetail?.totalAmount }} Item):
          <div class="ml-auto">
            Rp.
            {{
              transactionDetail?.totalPrice
                ? formatCurrency(transactionDetail.totalPrice)
                : 0
            }}
          </div>
        </div>
        <div class="flex items-center mt-3">
          <Lucide icon="CreditCard" class="w-4 h-4 mr-2 text-slate-500" />
          Total Poin:
          <div class="ml-auto">
            {{ transactionDetail?.totalPoint }}
          </div>
        </div>
        <div class="flex items-center mt-3">
          <Lucide icon="CreditCard" class="w-4 h-4 mr-2 text-slate-500" />
          Jumlah Bayar:
          <div class="ml-auto">
            Rp.
            {{
              transactionDetail?.paymentDetail?.paymentAmount
                ? formatCurrency(
                    transactionDetail?.paymentDetail?.paymentAmount
                  )
                : 0
            }}
          </div>
        </div>
        <div
          class="flex items-center pt-5 mt-5 font-medium border-t border-slate-200/60 dark:border-darkmode-400">
          <Lucide icon="CreditCard" class="w-4 h-4 mr-2 text-slate-500" />
          Jumlah Kembali:
          <div class="ml-auto">
            Rp.
            {{
              transactionDetail?.paymentDetail?.changeAmount
                ? formatCurrency(transactionDetail?.paymentDetail?.changeAmount)
                : 0
            }}
          </div>
        </div>
      </div>
      <!-- <div class="p-5 mt-5 rounded-md box">
        <div
          class="flex items-center pb-5 mb-5 border-b border-slate-200/60 dark:border-darkmode-400">
          <div class="text-base font-medium truncate">Shipping Information</div>
          <a href="" class="flex items-center ml-auto text-primary">
            <Lucide icon="MapPin" class="w-4 h-4 mr-2" /> Tracking Info
          </a>
        </div>
        <div class="flex items-center">
          <Lucide icon="Clipboard" class="w-4 h-4 mr-2 text-slate-500" />
          Courier: Left4code Express
        </div>
        <div class="flex items-center mt-3">
          <Lucide icon="Calendar" class="w-4 h-4 mr-2 text-slate-500" />
          Tracking Number: 003005580322
          <Lucide icon="Copy" class="w-4 h-4 ml-2 text-slate-500" />
        </div>
        <div class="flex items-center mt-3">
          <Lucide icon="MapPin" class="w-4 h-4 mr-2 text-slate-500" />
          Address: 260 W. Storm Street New York, NY 10025.
        </div>
      </div> -->
    </div>
    <div class="col-span-12 lg:col-span-7 2xl:col-span-8">
      <div class="p-5 rounded-md box">
        <div
          class="flex items-center pb-5 mb-5 border-b border-slate-200/60 dark:border-darkmode-400">
          <div class="text-base font-medium truncate">Detail Pesanan</div>
        </div>
        <div class="-mt-3 overflow-auto lg:overflow-visible">
          <TableOrderDetail
            :dataList="transactionDetail?.item"
            :cols="cols"
            :meta="pagination"
            :params="params"
            :loading="loading"
            @update="getParams" />
          <!-- <Table striped>
            <Table.Thead>
              <Table.Tr>
                <Table.Th class="whitespace-nowrap !py-5"> Product </Table.Th>
                <Table.Th class="text-right whitespace-nowrap">
                  Unit Price
                </Table.Th>
                <Table.Th class="text-right whitespace-nowrap"> Qty </Table.Th>
                <Table.Th class="text-right whitespace-nowrap">
                  Total
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr
                v-for="(faker, fakerKey) in _.take(fakerData, 8)"
                :key="fakerKey">
                <Table.Td class="!py-4">
                  <div class="flex items-center">
                    <div class="w-10 h-10 image-fit zoom-in">
                      <Tippy
                        as="img"
                        alt="Midone - HTML Admin Template"
                        class="border-2 border-white rounded-lg shadow-md"
                        :src="faker.images[0]"
                        :content="`Uploaded at ${faker.dates[0]}`" />
                    </div>
                    <a href="" class="ml-4 font-medium whitespace-nowrap">
                      {{ faker.products[0].name }}
                    </a>
                  </div>
                </Table.Td>
                <Table.Td class="text-right">
                  ${{ faker.totals[0] + ",000.00" }}
                </Table.Td>
                <Table.Td class="text-right">2</Table.Td>
                <Table.Td class="text-right">
                  ${{ faker.totals[0] * 2 + ",000.00" }}
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table> -->
        </div>
      </div>
    </div>
  </div>
  <!-- END: Transaction Details -->
</template>
