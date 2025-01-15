<template>
  <article>
    <div class="heading">
      <h2 class="devices-num">デバイス数：{{ devicesData.length }}</h2>
      <o-location />
    </div>
    <section class="devices-container">
      <o-tile v-for="device in devicesData" :key="device" :device-id="device" />
    </section>
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

  .heading {
    display: flex;
    align-items: center;
    margin-bottom: 1em;

    .devices-num {
      width: fit-content;
      margin-right: 0.5em;
      padding: 0 0.2em;

      border-bottom: 2px solid $main1_dull;
    }
  }

  .devices-container {
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    @include sp {
      flex-direction: column;
    }
    gap: 1.5em;
  }
}
</style>
