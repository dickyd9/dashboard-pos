<script setup lang="ts">
  import { computed } from "vue"
  import { ChartData, ChartOptions } from "chart.js/auto"
  import { useColorSchemeStore } from "../../stores/color-scheme"
  import { useDarkModeStore } from "../../stores/dark-mode"
  import Chart from "../../base-components/Chart"
  import { getColor } from "../../utils/colors"
  import { IReportPayment } from "@/_helper/types-api"

  const props = defineProps<{
    width?: number
    height?: number
    paymentUsage?: IReportPayment
  }>()

  const colorScheme = computed(() => useColorSchemeStore().colorScheme)
  const darkMode = computed(() => useDarkModeStore().darkMode)

  const chartColors = () => [
    getColor("pending", 0.9),
    getColor("warning", 0.9),
    getColor("primary", 0.9),
  ]
  const data = computed<ChartData>(() => {
    const paymentUsage = props?.paymentUsage as IReportPayment

    const paymentTypes = paymentUsage ? Object.keys(paymentUsage) : []
    const paymentValues = paymentUsage ? Object.values(paymentUsage) : []

    const colors = [
      getColor("warning", 0.9),
      getColor("primary", 0.9),
      getColor("success", 0.9),
      getColor("pending", 0.9),
      getColor("info", 0.9),
    ]

    return {
      labels: paymentTypes,
      datasets: [
        {
          data: paymentValues,
          backgroundColor: colors.slice(0, paymentValues.length),
          hoverBackgroundColor: colors.slice(0, paymentValues.length),
          borderWidth: 5,
          borderColor: darkMode.value
            ? getColor("darkmode.700")
            : getColor("white"),
        },
      ],
    }
  })

  const options = computed<ChartOptions>(() => {
    return {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
    }
  })
</script>

<template>
  <Chart
    type="pie"
    :width="props.width"
    :height="props.height"
    :data="data"
    :options="options" />
</template>
