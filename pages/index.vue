<template>
  <article>
    Hello, World
    <VBtn>Button</VBtn>
  </article>
</template>

<script setup lang="ts">
import type { StatusT } from "@/types/db";
import { getDatabase, ref as dbRef, onValue } from "firebase/database";

const deviceId = "kero";
const db = getDatabase();
const statusData = ref<StatusT[]>([]);
onValue(dbRef(db, `devices/${deviceId}/status`), (data) => {
  statusData.value = [];
  for (const key in data.val()) {
    statusData.value.push({
      datetime: key,
      status: data.val()[key],
    });
  }
});
</script>

<style scoped lang="scss"></style>
