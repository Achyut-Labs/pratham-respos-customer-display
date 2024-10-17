<template>
  <div class=" ">
    <div
      class="flex text-h6 text-primary text-bold q-px-sm q-pt-none mx-1 rounded-borders"
    >
      <div class="col q-pa-sm">
        {{
          cartStore.cartItems?.customer?.name ||
          cartStore.cartItems?.guestCustomerName ||
          'Guest'
        }}
        <div>
          Daily Order#
          {{ cartStore.cartItems?.daily_order_number }}
        </div>
      </div>
      <div
        v-if="cartStore.cartItems?.order_type?.type"
        class="col q-pa-sm text-right text-overline"
      >
        ( {{ cartStore.cartItems?.order_type?.type }} )
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
      <CardTotal />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import CardTotal from 'src/components/Table/CardTotal.vue';
import { QTableColumn } from 'quasar';
import { useMediaSettingsStore } from 'src/stores/media-settings-store';
import { storeToRefs } from 'pinia';
import { useCartStore } from '../stores/cart';

const settingStore = useMediaSettingsStore();
const cartStore = useCartStore();

const { displaySettings } = storeToRefs(settingStore);

// const cartItems = ref<OrderCart | null>(null);
// const customer = ref<Customer>({ id: 0, name: 'Guest', email: '', phone_no: '' });

const formatMoney = (value: number | string) => '$' + Number(value).toFixed(2);

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
</script>

<style scoped>
.table-layout {
  margin: 8px;
  width: 98%;
  height: calc(100vh - 260px);
  background-color: rgba(38, 36, 39, 0.034);
}
</style>
