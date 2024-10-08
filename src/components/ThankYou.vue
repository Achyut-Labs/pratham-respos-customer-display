
<script setup lang="ts">
import { onMounted } from 'vue';
import { Notify } from 'quasar';
import { useCartStore } from '../stores/cart';

const cartStore = useCartStore()
  onMounted(() => {
    Notify.create({
      message: 'Thank You! Enjoy Your Meal!',
      timeout: 4000,
      color: 'primary',
      icon: 'celebration',
      position: 'center',
      onDismiss() {
        delete cartStore.cartItems?.paid
      },
    })
  })
</script>
