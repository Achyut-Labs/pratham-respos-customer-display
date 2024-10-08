<template>
  <q-page class="flex items-center full-height" :class="cartStore.cartItems?.paid ? 'blurred' : ''">
    <CustomerDisplay
      v-if="mediaSettingsStore.displaySettings.screenDivision !== 100"
      class="flex-none"
      :class="
        mediaSettingsStore.displaySettings.screenDivision === 50
          ? 'w-1/2'
          : 'w-1/3'
      "
    />
    <Banner class="flex-1" />
    <ThankYou v-if="cartStore.cartItems?.paid" />
  </q-page>
</template>

<script setup lang="ts">
import CustomerDisplay from 'src/components/CartData.vue';
import Banner from 'src/components/BannerScreen.vue';
import ThankYou from 'src/components/ThankYou.vue'
import { useMediaSettingsStore } from '../stores/media-settings-store';
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useCartStore } from '../stores/cart';

const mediaSettingsStore = useMediaSettingsStore();
const cartStore = useCartStore()

const { displaySettings } = storeToRefs(mediaSettingsStore);

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
  const aspectRatioId = calculateAspectRatio(
    displaySettings.value.screenDivision
  );

  await mediaSettingsStore.getCustomerDisplayFile({
    restaurant_id: displaySettings.value.restaurantId,
    aspect_ratio_id: aspectRatioId,
    group_ids: String(displaySettings.value.groupToDisplay),
  });
};

onMounted(getFiles);
</script>

<style>
.blurred {
  filter: blur(5px);
  transition: filter 0.3s ease;
}
</style>
