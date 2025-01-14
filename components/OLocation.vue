<template>
  <v-dialog>
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn v-bind="activatorProps" class="button-container">位置情報設定</v-btn>
    </template>
    <template v-slot:default="{ isActive }">
      <v-card class="popup-container">
        <v-tabs v-model="tab" align-tabs="center">
          <v-tab value="home">ホーム地点</v-tab>
          <v-tab value="current">現在地</v-tab>
        </v-tabs>
        <v-tabs-window v-model="tab">
          <v-tabs-window-item key="home" value="home">
            <v-card flat>
              <v-card-text>
                <div v-if="homeLocation.lat === 0 && homeLocation.lat === 0">
                  <p>ホーム地点が設定されていません．</p>
                  <p>「現在地」からホーム地点を設定してください．</p>
                </div>
                <div v-else>
                  <p>緯度：{{ homeLocation.lat }}</p>
                  <p>経度：{{ homeLocation.lng }}</p>
                  <iframe
                    :src="`https://maps.google.com/maps?output=embed&ll=${homeLocation.lat},${homeLocation.lng}&t=m&hl=ja&z=16`"
                    class="map" style="border:0;" allowfullscreen="false" loading="lazy" />
                  <v-btn @click="deleteHomeLocation">ホーム地点を削除する</v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-tabs-window-item>
          <v-tabs-window-item key="current" value="current">
            <v-card flat>
              <v-card-text>
                <p>緯度：{{ currentLocation.lat }}</p>
                <p>経度：{{ currentLocation.lng }}</p>
                <iframe
                  :src="`https://maps.google.com/maps?output=embed&ll=${currentLocation.lat},${currentLocation.lng}&t=m&hl=ja&z=16`"
                  class="map" style="border:0;" allowfullscreen="false" loading="lazy" />
                <v-btn @click="setHomeLocation">現在地をホーム地点にする</v-btn>
              </v-card-text>
            </v-card>
          </v-tabs-window-item>
        </v-tabs-window>
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

const tab = ref<"home" | "current">("home");

const currentLocation = ref({ lat: 0, lng: 0 });
currentLocation.value = await getLocation() as { lat: number; lng: number };

const homeLocation = ref({ lat: 0, lng: 0 });
if (!localStorage.getItem("EnergyTracker_homeLocation")) {
  localStorage.setItem("EnergyTracker_homeLocation", JSON.stringify({ lat: 0, lng: 0 }));
}
homeLocation.value = JSON.parse(localStorage.getItem("EnergyTracker_homeLocation") as string);

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
  }
}
</style>
