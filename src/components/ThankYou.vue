<template>
  <q-dialog
    v-model="modelValue"
    persistent
    seamless
    transition-duration="1000"
    transition-show="jump-up"
    transition-hide="jump-down"
    backdrop-filter="brightness(60%)"
  >
    <q-card class="q-pa">
      <q-card-section>
        <div class="animated-text">
          <q-icon name="celebration" class="q-mr-md" />
          <span class="text-bold">Thank You For Your Order!</span>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { whenever } from '@vueuse/core';

const modelValue = defineModel({ default: false });

whenever(modelValue, () => {
  setTimeout(() => {
    modelValue.value = false; // Automatically close after 4 seconds
  }, 5000);
});
</script>

<style scoped>
/* Add any custom styles here if needed */
.animated-text {
  font-size: 30px; /* Start with a smaller size for smoothness */
  color: var(--q-primary);
  animation: colorChange 4s infinite ease-in-out;
}

@keyframes colorChange {
  0%,
  60%,
  100% {
    color: var(--q-primary);
  }
  40%,
  80% {
    color: #ffffff; /* Reddish */
  }
}

@keyframes sizeChange {
  0%,
  100% {
    font-size: 15px;
  }
  25%,
  75% {
    font-size: 30px;
  }
}
</style>
