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
      <v-table class="table" density="compact" fixed-header>
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
      </v-table>
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
}
</style>