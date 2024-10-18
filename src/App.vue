<template>
  <router-view />
  <ThankYou v-model="modelValue" />
</template>

<script lang="ts" setup>
import { useMediaSettingsStore } from './stores/media-settings-store';
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { SOCKET_EVENTS, useSocket } from './pages/useSocket';
import ThankYou from './components/ThankYou.vue';

const settingStore = useMediaSettingsStore();

const modelValue = ref(false);

const { connect } = useSocket({
  onMessage(eventName) {
    if (eventName === SOCKET_EVENTS.ORDER_PAID) {
      modelValue.value = true;
    }
  },
});

const { socketConfig } = storeToRefs(settingStore);

onMounted(() => {
  if (socketConfig.value.ip) {
    connect();
  }
});
</script>
