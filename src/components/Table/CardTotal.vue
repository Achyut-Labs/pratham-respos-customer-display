<template>
  <q-card class="bg-primary rounded-borders">
    <q-card-section>
      <div class="row q-col-gutter-md">
        <div class="col text-bold text-white font-17">Sub Total: </div>
        <div class="col text-right text-bold text-white font-17">${{ parseFloat(subTotal as string).toFixed(2) }}</div>
      </div>

      <div class="row q-col-gutter-md ">
        <div class="col font-17 text-bold text-white">Surcharge: <span v-if="cartStore.cartItems?.surcharge_type===2"> (+{{cartStore.cartItems?.surcharge_amount}}%) </span> </div>
        <div class="col font-17 text-right text-bold text-white">
           {{ surchargeAmount ? surchargeAmount : 0 }}
        </div>
      </div>

      <div class="row q-col-gutter-md ">
        <div class="col font-17 text-bold text-white">Discount: <span v-if="cartStore.cartItems?.discount_type===2"> (-{{cartStore.cartItems?.discount}}%) </span> </div>
        <div class="col font-17 text-right text-bold text-white">
           {{ discountAmount ? discountAmount : 0 }}
        </div>
      </div><hr/>
      <div class="row q-col-gutter-md ">
        <div class="col text-h4 text-bold text-white">Total: </div>
        <div class="col text-h4 text-right text-bold text-white">${{ parseFloat(totalAmount as string).toFixed(2) }}</div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '../../stores/cart'

const cartStore = useCartStore()
const subTotal = computed(
  () => cartStore.cartItems?.subTotal?.toFixed(2) ?? '0.00'
);
const totalAmount = computed(
  () => cartStore.cartItems?.totalAmount?.toFixed(2) ?? '0.00'
);

const formatAmount = (amount: number, type: number, isSurcharge: boolean) => {
  if (amount === 0) return undefined;
  const sign = isSurcharge ? '+' : '-';
  if(type===2) {
    let amt = cartStore.cartItems?.subTotal ? cartStore.cartItems?.subTotal * (amount / 100) : 0
    return `${sign} $${amt.toFixed(2)}`
  } else {
    return `${sign} $${amount.toFixed(2)}`
  }

};
const surchargeAmount = computed(() =>
  formatAmount(
    cartStore.cartItems?.surcharge_amount ?? 0,
    cartStore.cartItems?.surcharge_type ?? 0,
    true
  )
);
const discountAmount = computed(() =>
  formatAmount(
    cartStore.cartItems?.discount ?? 0,
    cartStore.cartItems?.discount_type ?? 0,
    false
  )
);


</script>

<style scoped>
</style>
