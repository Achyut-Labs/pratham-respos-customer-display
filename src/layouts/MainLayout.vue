<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view />

      <q-btn
        v-if="$q.platform.is.electron"
        class="absolute right-0 top-0"
        @click="toggleFullScreen"
        unelevated
        no-caps
        flat
        :ripple="false"
        icon="fa-solid fa-expand"
        size="xs"
        color="black"
      >
      </q-btn>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
const toggleFullScreen = () => {
  window.electronAPI.ipcRenderer.send('toggle-fullscreen');
};
</script>
