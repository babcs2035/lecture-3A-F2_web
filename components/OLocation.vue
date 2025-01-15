<template>
  <v-dialog>
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn v-bind="activatorProps" class="button-container">位置情報設定</v-btn>
    </template>
    <template v-slot:default="{ isActive }">
      <v-card class="popup-container">
        <p>現在地：({{ currentLocation.lat }}, {{ currentLocation.lng }})</p>
        <p>ホーム地点：{{ isHomeLocationSet ? `(${homeLocation.lat}, ${homeLocation.lng})` : "未設定" }}</p>
        <p v-if="isHomeLocationSet">ホーム地点までの距離：{{ distance }} m</p>
        <LMap class="map" :zoom="16" :center="[currentLocation.lat, currentLocation.lng]" :use-global-leaflet="false">
          <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
            layer-type="base" name="OpenStreetMap" />
          <LMarker :lat-lng="[currentLocation.lat, currentLocation.lng]">
            <LPopup>現在地</LPopup>
          </LMarker>
          <LMarker v-if="isHomeLocationSet" :lat-lng="[homeLocation.lat, homeLocation.lng]">
            <LPopup>ホーム地点</LPopup>
            <LIcon :icon-size="[24, 24]">
              <img src="~/assets/images/home.svg" alt="Home">
            </LIcon>
          </LMarker>
        </LMap>
        <v-btn @click="setHomeLocation" class="button">現在地をホーム地点にする</v-btn>
        <v-btn :disabled="!isHomeLocationSet" @click="deleteHomeLocation" class="button"
          color="warning">ホーム地点を削除する</v-btn>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
let watchId: number | null = null;
const currentLocation = ref({ lat: 0, lng: 0 });
const updatePosition = (position: GeolocationPosition) => {
  currentLocation.value.lat = position.coords.latitude;
  currentLocation.value.lng = position.coords.longitude;
  calcDistance();
}
const handleError = (error: GeolocationPositionError) => {
  console.error(error);
  alert(error);
};
onMounted(() => {
  if (navigator.geolocation) {
    watchId = navigator.geolocation.watchPosition(updatePosition, handleError);
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
  calcDistance();
});
onUnmounted(() => {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
  }
});

const homeLocation = ref({ lat: 0, lng: 0 });
if (!localStorage.getItem("EnergyTracker_homeLocation")) {
  localStorage.setItem("EnergyTracker_homeLocation", JSON.stringify({ lat: 0, lng: 0 }));
}
homeLocation.value = JSON.parse(localStorage.getItem("EnergyTracker_homeLocation") as string);
const isHomeLocationSet = computed(() => homeLocation.value.lat !== 0 || homeLocation.value.lng !== 0);

function setHomeLocation() {
  if (confirm("現在地をホーム地点に設定しますか？")) {
    homeLocation.value.lat = currentLocation.value.lat;
    homeLocation.value.lng = currentLocation.value.lng;
    localStorage.setItem("EnergyTracker_homeLocation", JSON.stringify(currentLocation.value));
    calcDistance();
  }
}

function deleteHomeLocation() {
  if (confirm("ホーム地点を削除しますか？")) {
    homeLocation.value = { lat: 0, lng: 0 };
    localStorage.setItem("EnergyTracker_homeLocation", JSON.stringify({ lat: 0, lng: 0 }));
  }
}

const distance = ref(0);
function calcDistance() {
  const R = 6378137.0;
  const f1 = currentLocation.value.lat * Math.PI / 180;
  const f2 = homeLocation.value.lat * Math.PI / 180;
  const l1 = currentLocation.value.lng * Math.PI / 180;
  const l2 = homeLocation.value.lng * Math.PI / 180;
  const a = Math.sin((l2 - l1) / 2) ** 2;
  const b = Math.cos(f1) * Math.cos(f2) * Math.sin((l2 - l1) / 2) ** 2;
  distance.value = 2 * R * Math.asin(Math.sqrt(a + b));
}

function sendNotification(message: string) {
  if (Notification.permission === "granted") {
    new Notification(message);
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification(message);
      }
    });
  }
};

setInterval(() => {
  calcDistance();
  if (distance.value >= 10) {
    function getLatestNotification(deviceId: string) {
      const notifications = JSON.parse(localStorage.getItem("EnergyTracker_notifications") || "[]");
      return notifications.filter((notification: { datetime: string; deviceId: string }) => notification.deviceId === deviceId).pop();
    }

    const statusData = useState("statusData");
    for (const deviceId in statusData.value) {
      if (statusData.value[deviceId] === "ON") {
        sendNotification(`デバイス ${deviceId} がオンのままだよ`);
        const notifications = JSON.parse(localStorage.getItem("EnergyTracker_notifications") || "[]");
        notifications.push({ datetime: new Date().toISOString(), deviceId });
        localStorage.setItem("EnergyTracker_notifications", JSON.stringify(notifications));
      }
    }
  }
}, 5000);
</script>

<style scoped lang="scss">
.button-container {
  margin-top: 2em;
}

:deep(.v-overlay__content) {
  width: fit-content;

  .popup-container {
    width: 80vw;
    max-width: 512px;
    margin: 0;
    padding: 1.5em 2em;

    .map {
      width: 100%;
      margin: 1.5em 0;

      aspect-ratio: 1;
    }

    .button {
      margin-top: 1em;
    }
  }
}


:deep(.leaflet-div-icon) {
  border: none;
  background: transparent;

  img {
    width: 24px;

    aspect-ratio: 1;
  }
}
</style>
