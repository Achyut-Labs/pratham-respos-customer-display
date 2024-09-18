<template>
  <q-card class="summary-card">
    <q-card-section>
      <div class="row q-col-gutter-md total-section">
        <div class="col text-h8 text-bold text-white">Sub Total: </div>
        <div class="col text-h8 text-right text-bold text-white">${{ subTotal }}</div>
      </div>

      <div v-if="surchargeAmount && surchargeAmount !== '0'" class="row q-col-gutter-md total-section">
        <div class="col text-h8 text-bold text-white">Surcharge: </div>
        <div class="col text-h8 text-right text-bold text-white">
           {{ surchargeAmount }}
        </div>
      </div>

      <div v-if="discountAmount && discountAmount !== '0'" class="row q-col-gutter-md total-section">
        <div class="col text-h8 text-bold text-white">Discount: </div>
        <div class="col text-h8 text-right text-bold text-white">
           {{ discountAmount }}
        </div>
      </div><hr/>
      <div class="row q-col-gutter-md total-section">
        <div class="col text-h4 text-bold text-white">Total: </div>
        <div class="col text-h4 text-right text-bold text-white">${{ totalAmount }}</div>
      </div><hr/>
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
.summary-card {
  background-color: #3949AB;
  border-radius: 8px;
}

.total-section {
  padding-top: 5px;
}

.text-bold {
  font-weight: bold;
}
</style>
