<template>
  <q-page class="row items-center justify-evenly full-height">
    <CustomerDisplay />
    <Banner />
  </q-page>
</template>

<script setup lang="ts">
import CustomerDisplay from 'src/components/CustmerScreen.vue';
import Banner from 'src/components/BannerScreen.vue';
</script>
