<template>
  <div>
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
div {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  min-height: 100lvh;
  overflow: hidden;

  main {
    flex-grow: 1;
  }
}
</style>
