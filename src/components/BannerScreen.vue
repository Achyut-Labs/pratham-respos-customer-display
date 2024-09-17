<template>
  <div class="col-6 image-container">
    <q-img src="src/assets/image.png" class="image-fit" />
  </div>
</template>

<script setup lang="ts">
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
