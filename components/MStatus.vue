<template>
  <section class="status-container">
    <h2>Status</h2>
    <client-only>
      <v-table class="table" density="compact" fixed-header>
        <thead>
          <tr>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="status in statusData" :key="status.datetime">
            <td>{{ status.datetime }}</td>
            <td>{{ status.status }}</td>
          </tr>
        </tbody>
      </v-table>
    </client-only>
  </section>
</template>

<script setup lang="ts">
import type { StatusT } from "@/types/db";
import { getDatabase, ref as dbRef, onValue } from "firebase/database";
import { formatDate } from "@/libs/date";

const selectedDevice = useState<string>("selectedDevice");
const statusData = ref<StatusT[]>([]);

watch(selectedDevice, () => {
  fetchStatusData();
});

function fetchStatusData() {
  const db = getDatabase();
  onValue(dbRef(db, `devices/${selectedDevice.value}/status`), (data) => {
    statusData.value = [];
    for (const key in data.val()) {
      statusData.value.push({
        datetime: formatDate(key),
        status: data.val()[key],
      });
    }
    statusData.value.sort((a, b) => {
      return a.datetime > b.datetime ? 1 : -1;
    });
  });
}
</script>

<style scoped lang="scss">
.status-container {
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
