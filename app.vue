<template>
  <nuxt-layout>
    <nuxt-page />
  </nuxt-layout>
</template>

<script setup lang="ts">
const defaultTitle = "34";

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - ${defaultTitle}` : defaultTitle;
  },
});
</script>
