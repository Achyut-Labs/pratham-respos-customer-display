<template>
  <q-card bordered flat class="bg- rounded-borders">
    <q-card-section class="text-slate-600">
      <div class="row q-col-gutter-md">
        <div class="col text-bold font-17">Sub Total:</div>
        <div class="col text-right text-bold font-17">
          ${{ parseFloat(subTotal as string).toFixed(2) }}
        </div>
      </div>

      <div class="row q-col-gutter-md">
        <div class="col font-17 text-bold">
          Discount:
          <span v-if="cartStore.cartItems?.discount_type === 2">
            ({{ cartStore.cartItems?.discount }}%)
          </span>
        </div>
        <div class="col font-17 text-right text-bold">
          {{ discountAmount ? discountAmount : 0 }}
        </div>
      </div>

      <div class="row q-col-gutter-md">
        <div class="col font-17 text-bold">
          Surcharge:
          <span v-if="cartStore.cartItems?.surcharge_type === 2">
            ({{ cartStore.cartItems?.surcharge_amount }}%)
          </span>
        </div>
        <div class="col font-17 text-right text-bold">
          {{ surchargeAmount ? surchargeAmount : 0 }}
        </div>
      </div>
      <hr />
      <div class="row q-col-gutter-md text-primary">
        <div class="col text-h4 text-bold">Total:</div>
        <div class="col text-h4 text-right text-bold">
          ${{ parseFloat(totalAmount as string).toFixed(2) }}
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCartStore } from '../../stores/cart';

const cartStore = useCartStore();
const subTotal = computed(
  () => cartStore.cartItems?.subTotal?.toFixed(2) ?? '0.00'
);
const totalAmount = computed(
  () => cartStore.cartItems?.totalAmount?.toFixed(2) ?? '0.00'
);

// const formatAmount = (amount: number, type: number, isSurcharge: boolean) => {
//   if (amount === 0) return undefined;
//   const sign = isSurcharge ? '+' : '-';
//   if(type===2) {
//     let amt = cartStore.cartItems?.subTotal ? cartStore.cartItems?.subTotal * (amount / 100) : 0
//     return `${sign} $${amt.toFixed(2)}`
//   } else {
//     return `${sign} $${amount.toFixed(2)}`
//   }

// };
const surchargeAmount = computed(() => {
  const val = calculateSurcharge();
  return `+$${val?.toFixed(2)}`;
});
const discountAmount = computed(() => {
  const val = calculateDiscount();
  return `-$${val?.toFixed(2)}`;
});

const calculateDiscount = () => {
  let val = 0;
  if (cartStore.cartItems?.discount && cartStore.cartItems?.subTotal) {
    val =
      cartStore.cartItems?.discount_type === 2
        ? cartStore.cartItems?.subTotal * (cartStore.cartItems?.discount / 100)
        : cartStore.cartItems?.discount;
  }
  return val;
};

const calculateSurcharge = () => {
  let val = 0;
  let discount = calculateDiscount();
  if (cartStore.cartItems?.subTotal && cartStore.cartItems?.surcharge_amount) {
    if (discount) {
      val =
        cartStore.cartItems?.surcharge_type === 2
          ? (cartStore.cartItems?.subTotal - discount) *
            (cartStore.cartItems?.surcharge_amount / 100)
          : cartStore.cartItems?.surcharge_amount;
    } else {
      val =
        cartStore.cartItems?.surcharge_type === 2
          ? cartStore.cartItems?.subTotal *
            (cartStore.cartItems?.surcharge_amount / 100)
          : cartStore.cartItems?.surcharge_amount;
    }
  }
  return val;
};
</script>
