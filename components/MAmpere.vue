<template>
  <section class="ampere-container">
    <h2>Ampere</h2>
    <a-chart :labels="ampereData.map((dat) => dat.datetime)" label="Ampere"
      :data="ampereData.map((dat) => dat.ampere)" />
    <client-only>
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
    </client-only>
  </section>
</template>

<script setup lang="ts">
import type { AmpereT } from "@/types/db";
import { getDatabase, ref as dbRef, onValue } from "firebase/database";
import { formatDate } from "@/libs/date";

const selectedDevice = useState<string>("selectedDevice");
const ampereData = ref<AmpereT[]>([]);

watch(selectedDevice, () => {
  fetchAmpereData();
});

function fetchAmpereData() {
  const db = getDatabase();
  onValue(dbRef(db, `devices/${selectedDevice.value}/ampere`), (data) => {
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
}
</script>

<style scoped lang="scss">
.ampere-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;

  .table {
    width: 100%;
    height: 256px;
  }
}
</style>
