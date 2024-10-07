import { defineStore } from 'pinia';
import { OrderCart } from 'src/types/cart';

interface State {
  cartItems: OrderCart | null
}

export const useCartStore = defineStore('cart', {
  state: (): State => ({
    cartItems: null
  }),
  getters: {},
  actions: {
  },
  persist: true,
});
