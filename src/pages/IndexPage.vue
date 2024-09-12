<template>
  <q-page class="row items-center justify-evenly full-height">
    <div class="col-6">
      <div class="customer-details text-center">
        <strong></strong> {{ customer.name || 'Guest' }}
      </div>
      <div class="customer-info">
        <div class="row justify-between customer-detail">
          <div class="col-auto text-left">
            <strong>Customer Id:</strong> {{ cartItems?.orderId }}
          </div>
          <div class="col-auto text-right">
            <strong>Order Id:</strong> #{{ cartItems?.daily_order_number }}
          </div>
        </div>
      </div>


      <q-table
        :rows="tableRows"
        :columns="columns"
        row-key="id"
        class="q-table"
        binary-state-sort
        flat
        hide-bottom
        :pagination="pagination"
      >
        <template v-slot:body-cell-nameWithModifiers="props">
          <q-td :props="props">
            <div v-html="props.row.nameWithModifiers"></div>
          </q-td>
        </template>

        <template v-slot:body-cell-quantity="props">
          <q-td :props="props">
            <div class="bold-text">{{ props.row.quantity }}</div>
          </q-td>
        </template>

        <template v-slot:body-cell-line_item_total="props">
          <q-td :props="props">
            <div class="bold-text">${{ props.row.line_item_total }}</div>
          </q-td>
        </template>
      </q-table>

      <div class="summary-wrapper">
        <q-card class="summary-card">
          <q-card-section>
            <div class="row q-col-gutter-md total-section">
              <div class="col text-h8 text-bold text-white">Sub Total: </div>
              <div class="col text-h8 text-right text-bold text-white">${{ subTotal }}</div>
            </div>
            <div v-if="surchargeAmount !== '0.00'" class="row q-col-gutter-md total-section">
              <div class="col text-h8 text-bold text-white">Surcharge: </div>
              <div class="col text-h8 text-right text-bold text-white">
                + {{ surchargeAmount }}{{ cartItems?.surcharge_type === 0 ? '%' : '' }}
              </div>
            </div>

            <div v-if="discountAmount !== '0.00'" class="row q-col-gutter-md total-section">
              <div class="col text-h8 text-bold text-white">Discount: </div>
              <div class="col text-h8 text-right text-bold text-white">
                - {{ discountAmount }}{{ cartItems?.discount_type === 0 ? '%' : '' }}
              </div>
            </div>
            <div class="row q-col-gutter-md total-section">
              <div class="col text-h4 text-bold text-white">Total: </div>
              <div class="col text-h4 text-right text-bold text-white">${{ totalAmount }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="col-6 image-container">
      <q-img src="src/assets/image.png" class="image-fit" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { onCartUpdate } from '../boot/local-socket';
import { OrderCart, Customer } from '../types/index';

const cartItems = ref<OrderCart | null>(null)
const customer = ref<Customer>({ name: '', email: '', phone_no: '', id: 0 });

const totalAmount = computed(() => {
  return cartItems.value?.totalAmount.toFixed(2) ?? '0.00'
})

const subTotal = computed(() => {
  return cartItems.value?.subTotal.toFixed(2) ?? '0.00'
})

const surchargeAmount = computed(() => {
  const amount = cartItems.value?.surcharge_amount ?? 0
  return cartItems.value?.surcharge_type === 1
    ? `$${amount}`
    : `${amount}%`
})

const discountAmount = computed(() => {
  const amount = cartItems.value?.discount ?? 0
  return cartItems.value?.discount_type === 1
    ? `$${amount}`
    : `${amount}%`
})

function updateCart(data: OrderCart) {
  console.log(data)
  cartItems.value = { ...data }
  customer.value = data.customer;
}

const tableRows = computed(() => {
  if (cartItems.value) {
    const items = cartItems.value.orderList.map(item => {
      let nameWithModifiers = `<strong>${item.name} ($${item.price.toFixed(2)})</strong>`

      if (item.notes && item.notes.trim()) {
        nameWithModifiers += `<br><e style="color: brown; font-weight: bold;">${item.notes}</e>`
      }

      if (item.modifiers.length > 0) {
        nameWithModifiers += '<br>' + item.modifiers.map(mod =>
          `- ${mod.modifier_name} ($${mod.price.toFixed(2)} x ${mod.quantity})`
        ).join('<br>')
      }

      return {
        ...item,
        nameWithModifiers
      }
    })

    return items
  }
  return []
})


const columns = [
  {
    name: 'nameWithModifiers',
    required: true,
    label: 'Items',
    align: 'left' as const,
    field: 'nameWithModifiers',
    style: 'white-space: pre-line;'
  },
  {
    name: 'quantity',
    label: 'Quantity',
    align: 'left' as const,
    field: 'quantity',
  },
  {
    name: 'line_item_total',
    label: 'Total',
    align: 'right' as const,
    field: (row: { line_item_total: string; }) => row.line_item_total,
  }
]

const pagination = ref({
  rowsPerPage: 9990
})

onMounted(() => {
  onCartUpdate(data => {
    return updateCart(data);
  })
})
</script>


<style scoped>
.q-table {
  margin: 8px;
  width: 98%;
  height: calc(100vh - 270px);
  background-color: rgba(38, 36, 39, 0.034);
}

.summary-card {
  background-color: #3949AB;
  border-radius: 8px;
  }

.summary-wrapper {
  padding: 9px;
}

.total-section {
  padding-top: 5px;
}

.text-bold {
  font-weight: bold;
}

.bold-text {
  font-weight: bold;
}

.full-height {
  height: 100vh;
}

.image-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.image-fit {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
}

.q-table__header .q-th {
  font-weight: bold;
}

.q-table__cell {
  white-space: pre-line;
}

.customer-info {
  padding: 6px;
  background-color: #f0f0f0;
  margin-bottom: 12px;
  border-radius: 5px;
}

.customer-details {
  font-size: 24px;
  text-transform: uppercase;
  font-weight: bold;
}
.customer-detail {
  font-size: 16px;
  font-weight: bold;
}
</style>

