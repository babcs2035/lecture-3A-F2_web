<template>
  <v-card class="detail-container">
    <div class="heading">
      <h2>{{ deviceId }}</h2>
      <p class="status" :style="getStatusStyle()">{{ status }}</p>
    </div>
    <v-select v-model="selectedPeriod" :items="periodOptions" label="Select Period" />
    <div v-if="filteredPowerData.length > 0">
      <a-chart :labels="filteredPowerData.map((dat) => dat.datetime)" label="Power"
        :data="filteredPowerData.map((dat) => dat.power)" :period="selectedPeriod" />
      <!-- <v-table class="table" density="compact" fixed-header>
        <thead>
          <tr>
            <th>Date</th>
            <th>Power</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="power in [...filteredPowerData].reverse()" :key="power.datetime">
            <td>{{ power.datetime.toLocaleString() }}</td>
            <td>{{ power.power }} W</td>
          </tr>
        </tbody>
      </v-table> -->
      <div class="details">
        <table>
          <thead>
            <tr>
              <th>Max</th>
              <th>Avg</th>
              <th>Min</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ maxPower.toFixed(1) }} W</td>
              <td>{{ averagePower.toFixed(1) }} W</td>
              <td>{{ minPower.toFixed(1) }} W</td>
            </tr>
          </tbody>
        </table>
        <p>Last Updated: {{ filteredPowerData[filteredPowerData.length - 1].datetime.toLocaleString() }}</p>
      </div>
    </div>
    <p v-else>データがありません</p>
  </v-card>
</template>

<script setup lang="ts">
import type { RecordT } from "@/types/db";
import { getDatabase, ref as dbRef, onValue } from "firebase/database";
import { formatDate } from "@/libs/date";
import { calcPower } from "@/libs/power";

const props = defineProps<{
  deviceId: string;
  status: string;
}>();

const powerData = ref<RecordT[]>([]);
const selectedPeriod = ref<string>("1 Hour");
const periodOptions = ["10 Minutes", "1 Hour", "12 Hours", "1 Day", "7 Days"];

const db = getDatabase();
onValue(dbRef(db, `devices/${props.deviceId}/amp`), (data) => {
  powerData.value = [];
  for (const key in data.val()) {
    powerData.value.push({
      datetime: formatDate(key),
      power: calcPower(data.val()[key]),
    });
  }
});

const filteredPowerData = computed(() => {
  const now = new Date();
  let cutoffDate = new Date();

  switch (selectedPeriod.value) {
    case "10 Minutes":
      cutoffDate = new Date(now.getTime() - 1000 * 60 * 10);
      break;
    case "1 Hour":
      cutoffDate = new Date(now.getTime() - 1000 * 60 * 60);
      break;
    case "12 Hours":
      cutoffDate = new Date(now.getTime() - 1000 * 60 * 60 * 12);
      break;
    case "1 Day":
      cutoffDate = new Date(now.getTime() - 1000 * 60 * 60 * 24);
      break;
    case "7 Days":
      cutoffDate = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7);
      break;
  }
  return powerData.value.filter((data) => new Date(data.datetime) >= cutoffDate);
});

function getStatusStyle() {
  if (props.status === "ON") {
    return {
      backgroundColor: '#81c784',
      borderColor: '#66bb6a'
    }
  }
  else if (props.status === "OFF") {
    return {
      backgroundColor: '#e3f2fd',
      borderColor: '#90caf9'
    }
  }
  else {
    return {
      backgroundColor: '#e57373',
      borderColor: '#f44336'
    }
  }
}

const averagePower = ref(0);
const maxPower = ref(0);
const minPower = ref(0);
watch(filteredPowerData, () => {
  let sum = 0;
  maxPower.value = 0;
  minPower.value = Number.MAX_SAFE_INTEGER;
  for (const data of filteredPowerData.value) {
    const n = Number(data.power);
    sum += n;
    if (n > maxPower.value) {
      maxPower.value = n;
    }
    if (n < minPower.value) {
      minPower.value = n;
    }
  }
  averagePower.value = sum / filteredPowerData.value.length;
});
</script>

<style scoped lang="scss">
.detail-container {
  width: 80vw;
  max-width: 640px;
  max-height: 80vh;
  padding: 1.2em 1.8em;

  .heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1em;
    cursor: default;


    .status {
      width: fit-content;
      padding: 0.2em 0.5em;
      border-radius: 0.2em;
      font-weight: 500;
      font-size: 1.2em;
    }
  }

  :deep(.v-table__wrapper) {
    max-height: 16em;
  }


  p {
    text-align: center;
  }

  .details {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    margin-top: 1em;

    table {
      margin-bottom: 1em;
      border-collapse: collapse;

      th,
      td {
        padding: 0.5em 1em;
        border: 1px solid rgba($main1_dull, 0.5);
      }

      th {
        background-color: rgba($main1_dull, 0.2);
      }
    }
  }
}
</style>