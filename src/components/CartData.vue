<template>
  <div class=" ">
    <div
      class="flex text-h5 bg-primary text-bold q-px-sm q-pb-sm q-pt-none mx-1 rounded-borders"
    >
      <div class="col q-pa-sm text-white">
        {{
          cartStore.cartItems?.customer?.name || cartStore.cartItems?.guestCustomerName || 'Guest'
        }} <span class="text-overline">( {{ cartStore.cartItems?.order_type?.type }} )</span>
      </div>
      <div class="col q-pa-sm text-white text-right">
        {{
          cartStore.cartItems && cartStore.cartItems.daily_order_number
            ? cartStore.cartItems.daily_order_number
            : ''
        }}
      </div>
    </div>
    <q-table
      :rows="tableRows"
      :columns="columns"
      row-key="id"
      class="table-layout"
      binary-state-sort
      flat
      hide-bottom
      :pagination="pagination"
    >
      <template v-slot:body-cell-nameWithModifiers="props">
        <q-td :props="props">
          <div :style="{ fontSize: displaySettings.lineItemFontSize }">
            <b class="font-bold">
              {{ props.row.name }}
              <span class="font-medium"
                >({{ formatMoney(props.row.price) }})</span
              >
            </b>
          </div>

          <div
            :style="{ fontSize: displaySettings.modifiersFontSize }"
            v-if="props.row.notes"
            class="text-yellow-600 font-semibold line-clamp-2"
          >
            {{ props.row.notes }}
          </div>

          <p
            v-for="(modifier, index) in props.row.modifiers"
            :key="index"
            :style="{ fontSize: displaySettings.modifiersFontSize }"
          >
            {{ modifier.modifier_name }}
            ({{ formatMoney(modifier.price) }}x{{ modifier.quantity }})
          </p>
        </q-td>
      </template>

      <template v-slot:body-cell-quantity="props">
        <q-td :props="props">
          <div class="text-bold">{{ props.row.quantity }}</div>
        </q-td>
      </template>

      <template v-slot:body-cell-line_item_total="props">
        <q-td :props="props">
          <div class="text-bold">
            ${{ parseFloat(props.row.line_item_total).toFixed(2) }}
          </div>
        </q-td>
      </template>

      <template v-slot:no-data>
        <q-td colspan="100%">
          <div class="text-center">No data available</div>
        </q-td>
      </template>
    </q-table>

    <div class="q-pa-sm q-pb-none">
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
import { OrderCart } from '../types/cart';
import CardTotal from 'src/components/Table/CardTotal.vue';
import { QTableColumn } from 'quasar';
import { useMediaSettingsStore } from 'src/stores/media-settings-store';
import { storeToRefs } from 'pinia';
import { useCartStore } from '../stores/cart';

const settingStore = useMediaSettingsStore();
const cartStore = useCartStore()

const { displaySettings } = storeToRefs(settingStore);

// const cartItems = ref<OrderCart | null>(null);
// const customer = ref<Customer>({ id: 0, name: 'Guest', email: '', phone_no: '' });

const subTotal = computed(
  () => cartStore.cartItems?.subTotal?.toFixed(2) ?? '0.00'
);
const totalAmount = computed(
  () => cartStore.cartItems?.totalAmount?.toFixed(2) ?? '0.00'
);

const formatMoney = (value: number | string) => '$' + Number(value).toFixed(2);

const formatAmount = (amount: number, type: number, isSurcharge: boolean) => {
  if (amount === 0) return undefined;
  const sign = isSurcharge ? '+' : '-';
  return type === 1 ? `${sign} $${amount.toFixed(2)}` : `${sign} ${amount}%`;
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

const updateCart = (data: OrderCart) => {
  cartStore.cartItems = {
    ...data,
    surcharge_amount: data.surcharge_amount ?? 0,
    surcharge_type: data.surcharge_type ?? 0,
    discount: data.discount ?? 0,
  };
  // customer.value = data.customer || data.guestCustomerName || { id: 0, name: 'Guest', email: '', phone_no: '' };
};

const tableRows = computed(
  () =>
  cartStore.cartItems?.orderList?.map((item) => ({
      ...item,
      nameWithModifiers: `<strong>${item.name} ($${(item.price ?? 0).toFixed(
        2
      )})</strong>${
        item.notes
          ? `<br><e style="color: brown; font-weight: bold;">${item.notes}</e>`
          : ''
      }${item.modifiers
        ?.map(
          (mod) =>
            `<br>- ${mod.modifier_name} ($${(mod.price ?? 0).toFixed(2)} x ${
              mod.quantity
            })`
        )
        .join('')}`,
    })) ?? []
);

const columns: QTableColumn[] = [
  {
    name: 'nameWithModifiers',
    required: true,
    label: 'Items',
    align: 'left',
    field: 'nameWithModifiers',
  },
  { name: 'quantity', label: 'Quantity', align: 'center', field: 'quantity' },
  {
    name: 'line_item_total',
    label: 'Total',
    align: 'right',
    field: 'line_item_total',
  },
];

const pagination = ref({ rowsPerPage: 9990 });

onMounted(() => {
  onCartUpdate(updateCart);
});
</script>

<style scoped>
.table-layout {
  margin: 8px;
  width: 98%;
  height: calc(100vh - 250px);
  background-color: rgba(38, 36, 39, 0.034);
}
</style>
