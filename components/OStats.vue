<template>
  <section class="stats-container">
    <m-status />
    <m-ampere />
  </section>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.stats-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

  gap: 16px;
}
</style>
