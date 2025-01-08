<template>
  <article>
    <client-only>
      <h2 class="devices-num">デバイス数：{{ devicesData.length }}</h2>
      <section class="devices-container">
        <o-tile v-for="device in devicesData" :key="device" :device-id="device" />
      </section>
    </client-only>
  </article>
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

</script>

<style scoped lang="scss">
article {
  width: 100%;
  padding: 1.5em 2em;

  .devices-num {
    width: fit-content;
    margin-bottom: 1em;
    padding: 0 0.5em;

    border-bottom: 2px solid $main1_dull;
  }

  .devices-container {
    display: flex;
    flex-wrap: wrap;

    gap: 1.5em;
  }
}
</style>
