<template>
  <router-view />
</template>

<script lang="ts" setup>
import { connectSocket } from './boot/local-socket';
import { useRouter } from 'vue-router';
import { useMediaSettingsStore } from './stores/media-settings-store';
import { onMounted } from 'vue';

const router = useRouter();
const mediaSettingsStore = useMediaSettingsStore();

const calculateAspectRatio = (screenSize: number): number => {
  let ar;
  if (screenSize === 50) {
    ar = '8:9';
  } else if (screenSize === 70) {
    ar = '5:4';
  } else {
    ar = '16:9';
  }
  const availableAspectRatio = mediaSettingsStore.aspectRatios?.filter(
    (item) => item.aspect_ratio === ar
  );

  return availableAspectRatio && availableAspectRatio?.length > 0
    ? availableAspectRatio[0].id
    : 0;
};

const getFiles = async () => {
  mediaSettingsStore.screenSize = Number(localStorage.getItem('ScreenSize'));
  mediaSettingsStore.group = Number(localStorage.getItem('group'));
  mediaSettingsStore.restaurantId = Number(
    localStorage.getItem('RestaurantId')
  );
  mediaSettingsStore.slideTransitionInterval = Number(
    localStorage.getItem('SlideTransitionInterval')
  );
  const aspectRatioId = calculateAspectRatio(mediaSettingsStore.screenSize);
  await mediaSettingsStore.getCustomerDisplayFile({
    restaurant_id: mediaSettingsStore.restaurantId,
    aspect_ratio_id: aspectRatioId,
    group_ids: String(mediaSettingsStore.group),
  });
};

onMounted(async () => {
  const localSocketServerIp = localStorage.getItem('localSocketServerIp');
  const localSocketServerPort = Number(
    localStorage.getItem('localSocketServerPort')
  );
  if (localSocketServerIp && localSocketServerPort) {
    connectSocket(localSocketServerIp, localSocketServerPort, router);
  }
  getFiles();
});
</script>
