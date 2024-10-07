<template>
  <q-card class="bg-primary rounded-borders">
    <q-card-section>
      <div class="row q-col-gutter-md">
        <div class="col text-bold text-white font-17">Sub Total: </div>
        <div class="col text-right text-bold text-white font-17">${{ parseFloat(subTotal as string).toFixed(2) }}</div>
      </div>

      <div class="row q-col-gutter-md ">
        <div class="col font-17 text-bold text-white">Surcharge: </div>
        <div class="col font-17 text-right text-bold text-white">
           {{ surchargeAmount ? surchargeAmount : 0 }}
        </div>
      </div>

      <div class="row q-col-gutter-md ">
        <div class="col font-17 text-bold text-white">Discount: </div>
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
defineProps({
  subTotal: String,
  surchargeAmount: String,
  discountAmount: String,
  totalAmount: String
});
</script>

<style scoped>
</style>
