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
  background-color: rgba($main3_soft, 0.2);

  main {
    flex-grow: 1;
  }
}
</style>
