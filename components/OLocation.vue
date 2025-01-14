<template>
  <v-dialog>
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn v-bind="activatorProps" class="button-container">位置情報設定</v-btn>
    </template>
    <template v-slot:default="{ isActive }">
      <v-card class="popup-container">
        <p>緯度：{{ location.lat }}</p>
        <p>経度：{{ location.lng }}</p>
        <iframe :src="mapURL" class="map" style="border:0;" allowfullscreen="false" loading="lazy" />
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
async function getLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        resolve({ lat: position.coords.latitude, lng: position.coords.longitude });
      });
    } else {
      alert("Geolocation is not supported by this browser.");
      reject("Geolocation is not supported by this browser.");
    }
  });
}

const location = ref({ lat: 0, lng: 0 });
setInterval(async () => {
  location.value = await getLocation() as { lat: number; lng: number };
}, 1000);

const mapURL = ref("");
watch(location, () => {
  const zoom = 16;
  mapURL.value = `https://maps.google.com/maps?output=embed&ll=${location.value.lat},${location.value.lng}&t=m&hl=ja&z=${zoom}`;
});

</script>

<style scoped lang="scss">
.button-container
{
  margin-top: 2em;
}

:deep(.v-overlay__content)
{
  width: fit-content;

  .popup-container
  {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 90vw;
    max-width: 512px;
    margin: 0;
    padding: 1.5em 2em;

    .map
    {
      width: 100%;
      margin-top: 1em;

      aspect-ratio: 1;
    }
  }
}
</style>
