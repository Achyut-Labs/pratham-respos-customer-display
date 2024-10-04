<template>
  <router-view />
</template>

<script lang="ts" setup>
import { connectSocket, onMediaSettingsUpdate } from './boot/local-socket';
import { useRouter } from 'vue-router';
import {
  ICustomerDisplaySettings,
  useMediaSettingsStore,
} from './stores/media-settings-store';
import { onMounted, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';

const router = useRouter();

const settingStore = useMediaSettingsStore();

const { socketConfig, displaySettings } = storeToRefs(settingStore);

const calculateAspectRatio = (screenSize: number): number => {
  let ar;
  if (screenSize === 50) {
    ar = '8:9';
  } else if (screenSize === 70) {
    ar = '5:4';
  } else {
    ar = '16:9';
  }
  const availableAspectRatio = settingStore.aspectRatios.filter(
    (item) => item.aspect_ratio === ar
  );
  return availableAspectRatio ? availableAspectRatio[0].id : 0;
};

const updateMediaSettings = async (data: ICustomerDisplaySettings) => {
  await settingStore.getAspectRatios();
  displaySettings.value.screenDivision = data.screenDivision;
  displaySettings.value.groupToDisplay = data.groupToDisplay;
  displaySettings.value.restaurantId = data.restaurantId;
  displaySettings.value.slideTransitionInterval = data.slideTransitionInterval;

  const aspectRatioId = calculateAspectRatio(data.screenDivision);
  await settingStore.getCustomerDisplayFile({
    restaurant_id: data.restaurantId,
    aspect_ratio_id: aspectRatioId,
    group_ids: String(data.groupToDisplay),
  });
};

onMounted(() => {
  onMediaSettingsUpdate(updateMediaSettings);
});

watchEffect(() => {
  if (socketConfig.value.ip && socketConfig.value.port) {
    connectSocket(socketConfig.value.ip, socketConfig.value.port, router);
  }
});
</script>
