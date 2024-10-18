<template>
  <router-view />
</template>

<script lang="ts" setup>
import { useMediaSettingsStore } from './stores/media-settings-store';
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useSocket } from './pages/useSocket';

const settingStore = useMediaSettingsStore();
const { connect } = useSocket();

const { socketConfig } = storeToRefs(settingStore);

onMounted(() => {
  if (socketConfig.value.ip) {
    connect();
  }
});
</script>
