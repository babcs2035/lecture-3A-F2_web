<template>
  <Line class="line" :key="`${label}-line-${renderKey}`" :data="chartData" :options="options" />
</template>

<script setup lang="ts">
import { Line } from "vue-chartjs";
import { ref, watch } from 'vue';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const props = defineProps<{
  labels: string[];
  label: string;
  data: number[];
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

const renderKey = ref(0);
watch(
  () => props,
  (newProps) => {
    chartData.value.labels = newProps.labels;
    chartData.value.datasets[0].label = newProps.label;
    chartData.value.datasets[0].data = newProps.data;
    renderKey.value++;
  },
  { deep: true }
);

const options = {
  responsive: false,
  maintainAspectRatio: false,
};
</script>

<style scoped>
.line {
  max-width: 100%;
  height: 256px;
}
</style>