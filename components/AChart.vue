<template>
  <Line class="line" :key="`${label}-line-${renderKey}`" :data="chartData" :options="options" />
</template>

<script setup lang="ts">
import { Line } from "vue-chartjs";
import { ref, watch } from "vue";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const props = defineProps<{
  labels: string[];
  label: string;
  data: number[];
  period: string;
}>();

const chartData = ref({
  labels: props.labels,
  datasets: [
    {
      label: props.label,
      backgroundColor: "#f87979",
      data: props.data,
    },
  ],
});

const options = ref({
  responsive: false,
  maintainAspectRatio: false,
  scales: {
    x: {
      type: "time",
      time: {
        unit: props.period === "1 Hour" ? "minute" : props.period === "1 Day" ? "hour" : "day",
        tooltipFormat: "PPpp", // Customize the tooltip format
        displayFormats: {
          day: "MMM d", // Customize the display format for days
        },
      },
      title: {
        display: true,
        text: "Date & Time",
      },
    },
    y: {
      title: {
        display: true,
        text: props.label,
      },
    },
  },
});

const renderKey = ref(0);
watch(
  () => props,
  (newProps) => {
    chartData.value.labels = newProps.labels;
    chartData.value.datasets[0].label = newProps.label;
    chartData.value.datasets[0].data = newProps.data;
    options.value.scales.x.time.unit = newProps.period === "1 Hour" ? "minute" : newProps.period === "1 Day" ? "hour" : "day";
    renderKey.value++;
  },
  { deep: true }
);
</script>

<style scoped>
.line {
  width: 100% !important;

  aspect-ratio: 4/3 !important;
}
</style>