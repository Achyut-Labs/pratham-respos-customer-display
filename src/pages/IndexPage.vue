<template>
  <q-page class="flex items-center full-height">
    <CustomerDisplay v-if="mediaSettingsStore.screenSize !== 100" class="flex-none" :class="mediaSettingsStore.screenSize === 50 ? 'w-1/2' : 'w-1/3' " />
    <Banner class="flex-1" />
  </q-page>
</template>

<script setup lang="ts">
import CustomerDisplay from 'src/components/CustmerScreen.vue';
import Banner from 'src/components/BannerScreen.vue';
import { useMediaSettingsStore } from '../stores/media-settings-store'

const mediaSettingsStore = useMediaSettingsStore()
</script>
