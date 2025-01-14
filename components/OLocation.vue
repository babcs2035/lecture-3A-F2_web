<template>
  <v-dialog>
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn v-bind="activatorProps" class="button-container">位置情報設定</v-btn>
    </template>
    <template v-slot:default="{ isActive }">
      <v-card class="popup-container">
        <p>現在地：({{ currentLocation.lat }}, {{ currentLocation.lng }})</p>
        <p>ホーム地点：{{ isHomeLocationSet ? `(${homeLocation.lat}, ${homeLocation.lng})` : "未設定" }}</p>
        <p v-if="isHomeLocationSet">ホーム地点までの距離：{{ calcDistance(currentLocation.lat, currentLocation.lng,
          homeLocation.lat, homeLocation.lng) }} m</p>
        <LMap class="map" :zoom="16" :center="[currentLocation.lat, currentLocation.lng]" :use-global-leaflet="false">
          <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
            layer-type="base" name="OpenStreetMap" />
          <LMarker :lat-lng="[currentLocation.lat, currentLocation.lng]">
            <LPopup>現在地</LPopup>
          </LMarker>
          <LMarker v-if="isHomeLocationSet" :lat-lng="[homeLocation.lat, homeLocation.lng]">
            <LPopup>ホーム地点</LPopup>
          </LMarker>
        </LMap>
        <v-btn @click="setHomeLocation" class="button">現在地をホーム地点にする</v-btn>
        <v-btn :disabled="!isHomeLocationSet" @click="deleteHomeLocation" class="button">ホーム地点を削除する</v-btn>
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

const currentLocation = ref({ lat: 0, lng: 0 });
currentLocation.value = await getLocation() as { lat: number; lng: number };
setInterval(async () => {
  currentLocation.value = await getLocation() as { lat: number; lng: number };
}, 1500);

const homeLocation = ref({ lat: 0, lng: 0 });
if (!localStorage.getItem("EnergyTracker_homeLocation")) {
  localStorage.setItem("EnergyTracker_homeLocation", JSON.stringify({ lat: 0, lng: 0 }));
}
homeLocation.value = JSON.parse(localStorage.getItem("EnergyTracker_homeLocation") as string);
const isHomeLocationSet = computed(() => homeLocation.value.lat !== 0 || homeLocation.value.lng !== 0);

function setHomeLocation() {
  if (confirm("現在地をホーム地点に設定しますか？")) {
    homeLocation.value = currentLocation.value;
    localStorage.setItem("EnergyTracker_homeLocation", JSON.stringify(currentLocation.value));
  }
}

function deleteHomeLocation() {
  if (confirm("ホーム地点を削除しますか？")) {
    homeLocation.value = { lat: 0, lng: 0 };
    localStorage.setItem("EnergyTracker_homeLocation", JSON.stringify({ lat: 0, lng: 0 }));
  }
}

function calcDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6378137.0;
  const f1 = lat1 * Math.PI / 180;
  const f2 = lat2 * Math.PI / 180;
  const l1 = lng1 * Math.PI / 180;
  const l2 = lng2 * Math.PI / 180;
  const a = Math.sin((l2 - l1) / 2) ** 2;
  const b = Math.cos(f1) * Math.cos(f2) * Math.sin((l2 - l1) / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a + b));
}
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
    width: 90vw;
    max-width: 512px;
    margin: 0;
    padding: 1.5em 2em;

    .map
    {
      width: 100%;
      margin: 1.5em 0;

      aspect-ratio: 1;
    }

    .button
    {
      margin-top: 1em;
    }
  }
}
</style>
