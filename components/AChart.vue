<template>
  <div class="chart-wrapper">
    <Line class="line" :key="`${label}-line-${renderKey}`" :data="chartData" :options="options" />
  </div>
</template>

<script setup lang="ts">
import { Line } from "vue-chartjs";
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
      lineTension: 0,
      label: props.label,
      backgroundColor: "#f87979",
      data: props.data,
    },
  ],
});

function getUnit() {
  switch (props.period) {
    case "10 Minutes":
      return "minute";
    case "1 Hour":
      return "minute";
    case "12 Hours":
      return "hour";
    case "1 Day":
      return "hour";
    case "7 Days":
      return "day";
  }
}
const options = ref({
  responsive: false,
  maintainAspectRatio: false,
  animation: false,
  scales: {
    x: {
      type: "time",
      time: {
        unit: getUnit(),
        tooltipFormat: "PPpp", // Customize the tooltip format
        displayFormats: {
          day: "MMM d", // Customize the display format for days
        },
      },
      title: {
        display: false,
        text: "Date & Time",
      },
    },
    y: {
      title: {
        display: false,
        text: props.label,
      },
    },
  },
  legend: {
    display: false,
  },
});

const renderKey = ref(0);
setInterval(() => {
  chartData.value.labels = props.labels;
  chartData.value.datasets[0].label = props.label;
  chartData.value.datasets[0].data = props.data;
  options.value.scales.x.time.unit = getUnit();
  renderKey.value++;
}, 1000);
</script>

<style scoped lang="scss">
.chart-wrapper {
  width: 100%;
  max-width: 100%;
  overflow: auto hidden;

  .line {
    padding: 0.5em;

    @include pc {
      width: 100% !important;
    }
    @include notpc {
      height: 320px !important;
    }
  }
}
</style>