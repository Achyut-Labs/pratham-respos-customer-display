<template>
  <q-page class="row items-center justify-evenly">
    <div class="col-6">
      <q-table
        :rows="tableRows"
        :columns="columns"
        row-key="id"
        class="q-table"
        binary-state-sort
        flat
        hide-bottom
        :footer-props="footerProps"
        :pagination="pagination"
      />
      <div class="total-wrapper q-mt-md">
        <q-card class="total-card">
          <q-card-section>
            <div class="text-center text-h6 text-white">
              Total: {{ totalAmount }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="col-6">
      <q-img src="src/assets/pratham_pos.png" class="fit" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { onCartUpdate } from '../boot/local-socket';
import { OrderCart } from '../types/cart';

const cartItems = ref<OrderCart | null>(null)

  const totalAmount = computed(() => {
  return cartItems.value?.totalAmount ?? 0
})

function updateCart(data: OrderCart) {
  console.log(data)
  cartItems.value = { ...data }
}

const tableRows = computed(() => {
  if (cartItems.value) {
    return [...cartItems.value.orderList]
  }
  return []
})

const columns = [
  {
    name: 'name',
    required: true,
    label: 'Item',
    align: 'left' as const,
    field: 'name',
    headerClasses: 'text-bold'
  },
  {
    name: 'quantity',
    label: 'Quantity',
    align: 'left' as const,
    field: 'quantity',
    headerClasses: 'text-bold'
  },
  {
    name: 'line_item_total',
    label: 'Price',
    align: 'right' as const,
    field: 'line_item_total',
    headerClasses: 'text-bold'
  }
]


const footerProps = {
  bottom: true,
  class: 'text-bold',
  rows: [
    {
      name: 'Total',
      quantity: '',
      line_item_total: cartItems.value ? cartItems.value.totalAmount : 0
    }
  ]
}

const pagination = ref({
  rowsPerPage: 9990
})

onMounted(() => {
  onCartUpdate(data => {
    updateCart(data)
  })
})

onUnmounted(() => {})
</script>

<style scoped>
.q-table {
  width: 100%;
  height: calc(100vh - 130px);
  background-color: rgba(142, 0, 250, 0.123);
}

.total-card {
  background-color: #003366;
  border-radius: 8px;
  padding: 16px;
}

.total-wrapper {
  margin-top: 16px;
}

.fit {
  width: 100%;
  height: 100%;
}

.q-table__header .q-th {
  font-weight: bold;
}
</style>



