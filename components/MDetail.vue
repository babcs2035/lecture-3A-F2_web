<template>
  <v-card class="detail-container">
    <h2>{{ deviceId }}</h2>
    <v-select v-model="selectedPeriod" :items="periodOptions" label="Select Period" />
    <div v-if="filteredAmpereData.length > 0">
      <a-chart :labels="filteredAmpereData.map((dat) => dat.datetime)" label="Ampere"
        :data="filteredAmpereData.map((dat) => dat.ampere)" :period="selectedPeriod" />
      <v-table class="table" density="compact" fixed-header>
        <thead>
          <tr>
            <th>Date</th>
            <th>Ampere</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ampere in [...filteredAmpereData].reverse()" :key="ampere.datetime">
            <td>{{ ampere.datetime.toLocaleString() }}</td>
            <td>{{ ampere.ampere }}</td>
          </tr>
        </tbody>
      </v-table>
    </div>
    <p v-else>データがありません</p>
  </v-card>
</template>

<script setup lang="ts">
import type { AmpereT } from "@/types/db";
import { getDatabase, ref as dbRef, onValue } from "firebase/database";
import { formatDate } from "@/libs/date";
import { ref, computed } from "vue";

const props = defineProps<{
  deviceId: string;
}>();

const ampereData = ref<AmpereT[]>([]);
const selectedPeriod = ref<string>("1 Hour");
const periodOptions = ["1 Hour", "1 Day", "7 Days"];

const db = getDatabase();
onValue(dbRef(db, `devices/${props.deviceId}/ampere`), (data) => {
  ampereData.value = [];
  for (const key in data.val()) {
    ampereData.value.push({
      datetime: formatDate(key),
      ampere: data.val()[key],
    });
  }
});

const filteredAmpereData = computed(() => {
  const now = new Date();
  let cutoffDate = new Date();

  switch (selectedPeriod.value) {
    case "1 Hour":
      cutoffDate = new Date(now.getTime() - 1000 * 60 * 60);
      break;
    case "1 Day":
      cutoffDate = new Date(now.getTime() - 1000 * 60 * 60 * 24);
      break;
    case "7 Days":
      cutoffDate = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7);
      break;
  }

  return ampereData.value.filter((data) => new Date(data.datetime) >= cutoffDate);
});
</script>

<style scoped>
.detail-container
{
  padding: 1.2em 1.8em;
  width: 80vw;
  max-width: 640px;
  max-height: 80vh;

  h2
  {
    margin-bottom: 0.5em;
  }

  :deep(.v-table__wrapper)
  {
    max-height: 16em;
  }

  p
  {
    text-align: center;
  }
}
</style>