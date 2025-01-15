<template>
  <v-dialog>
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn v-bind="activatorProps" class="tile-container" :style="getTileStyle()">
        <p class="title heading-font">{{ deviceId }}</p>
        <p class="info">{{ status }}</p>
        <p v-if="status !== 'UNKNOWN'" class="info">{{ ampere }} mA</p>
        <p class="datetime">{{ datetime.toLocaleString() }}</p>
      </v-btn>
    </template>

    <template v-slot:default="{ isActive }">
      <m-detail :device-id="deviceId" />
      <!-- <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text="Close Dialog" @click="isActive.value = false"></v-btn>
      </v-card-actions> -->
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
import { getDatabase, ref as dbRef, onValue } from "firebase/database";
import { formatDate } from "@/libs/date";

const props = defineProps<{
  deviceId: string;
}>();
const datetime = ref<Date | null>(null);
const status = ref<"ON" | "OFF" | "UNKNOWN">("UNKNOWN");
const ampere = ref<number | null>(null);

const db = getDatabase();
onValue(dbRef(db, `devices/${props.deviceId}/status`), (data) => {
  datetime.value = formatDate(Object.keys(data.val()).pop() as string);
  status.value = Object.values(data.val()).pop() as boolean ? "ON" : "OFF";
  updateStatus();
});
onValue(dbRef(db, `devices/${props.deviceId}/ampere`), (data) => {
  datetime.value = formatDate(Object.keys(data.val()).pop() as string);
  ampere.value = Object.values(data.val()).pop() as number;
});

function updateStatus() {
  if (new Date().getTime() - datetime.value!.getTime() > 1000 * 60) {
    status.value = "UNKNOWN";
  }
}

setInterval(() => {
  updateStatus();
}, 1000);

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
  width: 16em;
  height: 16em !important;
  border: 2px solid $main1_soft;
  border-radius: 1em;

  :deep(.v-btn__content) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-weight: normal;
    font-family: "Noto Sans JP", serif;
    letter-spacing: normal;
    text-transform: none;
  }

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

:deep(.v-overlay__content) {
  width: fit-content !important;
}
</style>
