<script setup lang="ts">
  import { defineProps, computed } from "vue"
  import { ChartData, ChartOptions } from "chart.js/auto"
  import { useColorSchemeStore } from "../../stores/color-scheme"
  import { useDarkModeStore } from "../../stores/dark-mode"
  import Chart from "../../base-components/Chart"
  import { getColor } from "../../utils/colors"
  import { formatCurrency, formatDate } from "@/utils/helper"

  // Interface untuk data laporan pendapatan
  interface IReportIncome {
    month: string
    year: string
    totalIncome: number
    totalExpense: number
    summary: number
  }

  // Props dengan interface
  const props = defineProps<{
    width?: number
    height?: number
    dataIncome?: IReportIncome // Menggunakan interface IReportIncome untuk props dataIncome
  }>()

  const colorScheme = computed(() => useColorSchemeStore().colorScheme)
  const darkMode = computed(() => useDarkModeStore().darkMode)

  // Konversi data props menjadi ChartData
  const data = computed(() => {
    const dataIncome = props.dataIncome
    if (dataIncome) {
      return {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        datasets: [
          {
            label: "Pemasukan",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, dataIncome.totalIncome, 0],
            borderWidth: 2,
            borderColor: colorScheme.value ? getColor("primary", 0.8) : "",
            backgroundColor: "transparent",
            pointBorderColor: "transparent",
            tension: 0.4,
          },
          {
            label: "Pengeluaran",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, dataIncome.totalExpense, 0],
            borderWidth: 2,
            borderDash: [2, 2],
            borderColor: darkMode.value
              ? getColor("slate.400", 0.6)
              : getColor("slate.400"),
            backgroundColor: "transparent",
            pointBorderColor: "transparent",
            tension: 0.4,
          },
        ],
      }
    } else {
      return {
        labels: [],
        datasets: [],
      }
    }
  })

  const options = computed<ChartOptions>(() => {
    return {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          // display: false,
        },
      },
      scales: {
        x: {
          ticks: {
            font: {
              size: 12,
            },
            color: getColor("slate.500", 0.8),
          },
          grid: {
            display: false,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            font: {
              size: 12,
            },
            color: getColor("slate.500", 0.8),
            callback: function (value: any) {
              return "Rp. " + formatCurrency(value)
            },
          },
          grid: {
            color: darkMode
              ? getColor("slate.500", 0.3)
              : getColor("slate.300"),
            borderDash: [2, 2],
            drawBorder: false,
          },
        },
      },
    }
  })
</script>

<template>
  <Chart
    type="line"
    :width="props.width"
    :height="props.height"
    :data="data"
    :options="options" />
</template>
