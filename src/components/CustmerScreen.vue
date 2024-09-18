<template>
  <div class="col-6">
    <div class="text-h5 text-bold text-center q-px-sm q-pb-sm q-pt-none">
      <div class="q-pa-sm bg-primary text-white rounded-borders">
        {{ customer?.name || 'Guest' }} {{ cartItems && cartItems.daily_order_number ? '- #' + cartItems.daily_order_number: '' }}
      </div>
    </div>
    <div class="">
      <div class="row justify-between q-pa-sm bg-grey-3">
        <div class="col-auto text-left">
          <strong>Order Id:</strong> {{ cartItems?.orderId }}
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
          <div class="text-bold">{{ props.row.quantity }}</div>
        </q-td>
      </template>

      <template v-slot:body-cell-line_item_total="props">
        <q-td :props="props">
          <div class="text-bold">${{ parseFloat(props.row.line_item_total).toFixed(2) }}</div>
        </q-td>
      </template>

      <template v-slot:no-data>
        <q-td colspan="100%">
          <div class="text-center">No data available</div>
        </q-td>
      </template>
    </q-table>

    <div class="q-pa-sm">
      <CardTotal
        :subTotal="subTotal"
        :surchargeAmount="surchargeAmount"
        :discountAmount="discountAmount"
        :totalAmount="totalAmount"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { onCartUpdate } from '../boot/local-socket';
import { Customer, OrderCart } from '../types/cart';
import CardTotal from 'src/components/Table/CardTotal.vue';
import { QTableColumn } from 'quasar';

const cartItems = ref<OrderCart | null>(null);
const customer = ref<Customer>({ id: 0, name: 'Guest', email: '', phone_no: '' });

const subTotal = computed(() => cartItems.value?.subTotal?.toFixed(2) ?? '0.00');
const totalAmount = computed(() => cartItems.value?.totalAmount?.toFixed(2) ?? '0.00');
const formatAmount = (amount: number, type: number, isSurcharge: boolean) => {
  if (amount === 0) return undefined;
  const sign = isSurcharge ? '+' : '-';
  return type === 1 ? `${sign} $${amount.toFixed(2)}` : `${sign} ${amount}%`;
};
const surchargeAmount = computed(() => formatAmount(cartItems.value?.surcharge_amount ?? 0, cartItems.value?.surcharge_type ?? 0, true));
const discountAmount = computed(() => formatAmount(cartItems.value?.discount ?? 0, cartItems.value?.discount_type ?? 0, false));

const updateCart = (data: OrderCart) => {
  cartItems.value = { ...data, surcharge_amount: data.surcharge_amount ?? 0, surcharge_type: data.surcharge_type ?? 0, discount: data.discount ?? 0 };
  customer.value = data.customer || { id: 0, name: 'Guest', email: '', phone_no: '' };
};

const tableRows = computed(() => cartItems.value?.orderList?.map(item => ({
  ...item,
  nameWithModifiers: `<strong>${item.name} ($${(item.price ?? 0).toFixed(2)})</strong>${item.notes ? `<br><e style="color: brown; font-weight: bold;">${item.notes}</e>` : ''}${item.modifiers?.map(mod => `<br>- ${mod.modifier_name} ($${(mod.price ?? 0).toFixed(2)} x ${mod.quantity})`).join('')}`
})) ?? []);

const columns: QTableColumn[] = [
  { name: 'nameWithModifiers', required: true, label: 'Items', align: 'left', field: 'nameWithModifiers' },
  { name: 'quantity', label: 'Quantity', align: 'center', field: 'quantity' },
  { name: 'line_item_total', label: 'Total', align: 'right', field: 'line_item_total' }
];

const pagination = ref({ rowsPerPage: 9990 });

onMounted(() => {
  onCartUpdate(updateCart);
});

</script>

<style scoped>
.q-table {
  margin: 8px;
  width: 98%;
  height: calc(100vh - 300px);
  background-color: rgba(38, 36, 39, 0.034);
}
</style>
