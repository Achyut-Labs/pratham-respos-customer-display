import { defineStore } from 'pinia';
import { EmitOrderCartData } from 'src/types/cart';

interface State {
  cartItems: EmitOrderCartData | null
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
