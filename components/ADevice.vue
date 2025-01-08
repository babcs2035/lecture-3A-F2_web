<template>
  <section class="device-container">
    <v-select label="デバイス ID" density="comfortable" :items="devicesData" v-model="selectedDevice" />
  </section>
</template>

<script setup lang="ts">
import { getDatabase, ref as dbRef, onValue } from "firebase/database";

const db = getDatabase();
const devicesData = ref<string[]>([]);
onValue(dbRef(db, `devices`), (data) => {
  devicesData.value = [];
  for (const key in data.val()) {
    devicesData.value.push(key);
  }
});

const selectedDevice = useState<string>("selectedDevice", () => "");
</script>

<style scoped lang="scss">
.device-container {
  width: 16rem;
}
</style>
