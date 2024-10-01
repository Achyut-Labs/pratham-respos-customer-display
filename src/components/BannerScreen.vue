<template>
  <div class="image-container">
    <q-img src="src/assets/image.png" class="image-fit" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { onMediaSettingsUpdate } from '../boot/local-socket';
import { MediaSettings } from '../types/mediaSettings';
import { useMediaSettingsStore } from '../stores/media-settings-store';

const mediaSettingsStore = useMediaSettingsStore()

const updateMediaSettings = async (data: MediaSettings) => {
 mediaSettingsStore.screenSize = data.size
 mediaSettingsStore.group = data.group
 mediaSettingsStore.restaurantId = data.restaurantId
 localStorage.setItem('ScreenSize', String(data.size))
 localStorage.setItem('Group', String(data.group))
 localStorage.setItem('RestaurantId', String(data.restaurantId))
//  const files = mediaSettingsStore.getCustomerDisplayFile({restaurant_id: data.restaurantId, aspect_ratio_id: 1, group_ids: [data.group]})
//  console.log(files)
}
onMounted(() => {
  onMediaSettingsUpdate(updateMediaSettings)
})
</script>

<style scoped>
.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  overflow: hidden;
}

.image-fit {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>
