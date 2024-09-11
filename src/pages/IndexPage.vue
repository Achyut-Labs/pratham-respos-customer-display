<template>
  <q-page class="row items-center justify-evenly">
    {{ cartItems }}
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { onCartUpdate } from '../boot/local-socket';
import { OrderCart } from '../types/cart';

const cartItems = ref<OrderCart | null>(null)

  function updateCart(data: OrderCart) {
    console.log(data)
    cartItems.value = {...data}
    console.log(cartItems.value)
  }

  onMounted(() => {
    onCartUpdate(data => {
      updateCart(data)
    })
  })

  onUnmounted(() => {
  })
</script>
