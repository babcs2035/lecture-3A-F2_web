<template>
  <section class="tile-container" :style="getTileStyle()">
    <p class="title heading-font">{{ deviceId }}</p>
    <p class="info">{{ status }}</p>
    <p v-if="status !== 'UNKNOWN'" class="info">{{ ampere }} mA</p>
    <p class="datetime">{{ datetime }}</p>
  </section>
</template>

<script setup lang="ts">
import { getDatabase, ref as dbRef, onValue } from "firebase/database";
import { formatDate } from "@/libs/date";

const props = defineProps<{
  deviceId: string;
}>();
const datetime = ref<string | null>(null);
const status = ref<"ON" | "OFF" | "UNKNOWN">("UNKNOWN");
const ampere = ref<number | null>(null);

const db = getDatabase();
onValue(dbRef(db, `devices/${props.deviceId}/status`), (data) => {
  datetime.value = formatDate(Object.keys(data.val()).pop() as string);
  status.value = Object.values(data.val()).pop() as boolean ? "ON" : "OFF";
});
onValue(dbRef(db, `devices/${props.deviceId}/ampere`), (data) => {
  datetime.value = formatDate(Object.keys(data.val()).pop() as string);
  ampere.value = Object.values(data.val()).pop() as number;
});

function getTileStyle() {
  if (status.value === "ON") {
    return {
      backgroundColor: '#81c784',
      borderColor: '#66bb6a'
    }
  }
  else if (status.value === "OFF") {
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
.tile-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 16em;
  border: 2px solid $main1_soft;
  border-radius: 1em;
  user-select: none;

  aspect-ratio: 1;

  .title {
    max-width: 95%;
    margin-bottom: 1rem;
    font-weight: bold;
    font-size: 1.5em;
    text-align: center;
  }

  .info {
    font-size: 1.2em;
  }

  .datetime {
    margin-top: 1em;
    color: rgba($text_black, 0.8);
    font-size: 1em;
  }
}
</style>
