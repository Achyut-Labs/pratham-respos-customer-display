<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount } from 'vue';
import { connectSocket } from './boot/local-socket';
import { useRouter } from 'vue-router';

const router = useRouter()

export default defineComponent({
  name: 'App'
})

onBeforeMount(() => {
  const localSocketServerIp = localStorage.getItem('localSocketServerIp')
  if(localSocketServerIp) {
    connectSocket(localSocketServerIp, router)
  }
})
</script>
