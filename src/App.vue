<template>
  <router-view />
</template>

<script lang="ts" setup>
import { useMediaSettingsStore } from './stores/media-settings-store';
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useSocket } from './pages/useSocket';

const settingStore = useMediaSettingsStore();

const { socketConfig } = storeToRefs(settingStore);
const { connectSocket } = useSocket();

onMounted(() => {
  if (socketConfig.value.ip && socketConfig.value.port) {
    connectSocket();
  }
});
</script>
