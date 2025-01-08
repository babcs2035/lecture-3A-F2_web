<template>
  <v-card class="detail-container">
    <h2>{{ deviceId }}</h2>
    <a-chart :labels="ampereData.map((dat) => dat.datetime)" label="Ampere"
      :data="ampereData.map((dat) => dat.ampere)" />
    <v-table class="table" density="compact" fixed-header>
      <thead>
        <tr>
          <th>Date</th>
          <th>Ampere</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="ampere in ampereData" :key="ampere.datetime">
          <td>{{ ampere.datetime }}</td>
          <td>{{ ampere.ampere }}</td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
</template>

<script setup lang="ts">
import type { AmpereT } from '@/types/db';
import { getDatabase, ref as dbRef, onValue } from "firebase/database";
import { formatDate } from "@/libs/date";

const props = defineProps<{
  deviceId: string;
}>();
const ampereData = ref<AmpereT[]>([]);
const db = getDatabase();
onValue(dbRef(db, `devices/${props.deviceId}/ampere`), (data) => {
  ampereData.value = [];
  for (const key in data.val()) {
    ampereData.value.push({
      datetime: formatDate(key),
      ampere: data.val()[key],
    });
  }
  ampereData.value.sort((a, b) => {
    return a.datetime > b.datetime ? 1 : -1;
  });
});
</script>

<style scoped lang="scss">
.detail-container {
  width: 70vw;
  margin: auto;
  padding: 1.5em 2em;

  .table {
    width: 100%;
    height: 256px;
    margin-top: 2em;
  }
}
</style>
