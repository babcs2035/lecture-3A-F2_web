<template>
  <nuxt-layout>
    <nuxt-page />
  </nuxt-layout>
</template>

<script setup lang="ts">
const defaultTitle = "amp-track";

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - ${defaultTitle}` : defaultTitle;
  },
});
</script>
