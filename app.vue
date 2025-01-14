<template>
  <nuxt-layout>
    <nuxt-pwa-manifest />
    <nuxt-page />
  </nuxt-layout>
</template>

<script setup lang="ts">
const defaultTitle = "Energy Track";

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - ${defaultTitle}` : defaultTitle;
  },
});
</script>
