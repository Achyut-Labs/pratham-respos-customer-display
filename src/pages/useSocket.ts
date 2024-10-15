import { Loading, Platform } from 'quasar';
import { io, Socket } from 'socket.io-client';
import { onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { EmitOrderCartData } from 'src/types/cart';
import {
  ICustomerDisplaySettings,
  useMediaSettingsStore,
} from 'src/stores/media-settings-store';
import { storeToRefs } from 'pinia';
import { useCartStore } from 'src/stores/cart';

export const useSocket = () => {
  const socket = ref<Socket | null>(null);
  const router = useRouter();
  const cartStore = useCartStore();
  const settingStore = useMediaSettingsStore();
  const { socketConfig, displaySettings } = storeToRefs(settingStore);

  const calculateAspectRatio = (screenSize: number): number => {
    const aspectRatios = {
      50: '8:9',
      70: '5:4',
      default: '16:9',
    };

    const ar =
      aspectRatios[screenSize as keyof typeof aspectRatios] ||
      aspectRatios.default;
    const availableAspectRatio = settingStore.aspectRatios.find(
      (item) => item.aspect_ratio === ar
    );

    return availableAspectRatio ? availableAspectRatio.id : 0;
  };

  const updateMediaSettings = async (data: ICustomerDisplaySettings) => {
    await settingStore.getAspectRatios();
    displaySettings.value = { ...data };

    const aspectRatioId = calculateAspectRatio(data.screenDivision);
    await settingStore.getCustomerDisplayFile({
      restaurant_id: data.restaurantId,
      aspect_ratio_id: aspectRatioId,
      group_ids: String(data.groupToDisplay),
    });
  };

  const updateCart = (data: EmitOrderCartData) => {
    cartStore.cartItems = {
      ...data,
      surcharge_amount: data.surcharge_amount ?? 0,
      surcharge_type: data.surcharge_type ?? 0,
      discount: data.discount ?? 0,
    };
  };

  const connectSocket = () => {
    const { ip, port } = socketConfig.value;
    const protocol = Platform.is.cordova ? 'https' : 'http';
    const socketUrl = `${protocol}://${ip}:${port}`;

    // Close existing connection if any
    if (socket.value) {
      socket.value.disconnect();
      console.log('Existing socket connection closed.');
    }

    socket.value = io(socketUrl, {
      autoConnect: false,
      reconnectionDelay: 2000,
      reconnectionAttempts: 10,
    });

    // Handle socket events
    socket.value.on('connect', () => {
      Loading.show();
      console.log('Connected to the local socket');
      setTimeout(() => {
        router.push('/');
        Loading.hide();
      }, 1000);
    });

    socket.value.on('connect_error', (error) => {
      console.error('Local Socket Connection error:', error.message);
      router.push('/start');
    });

    socket.value.on('disconnect', () => {
      console.log('Disconnected from the local socket');
    });

    // Listen for events
    socket.value.on('update-cart', updateCart);
    socket.value.on('customer-display-settings', updateMediaSettings);
    socket.value.on('setup', (data) => {
      const settingsStore = useMediaSettingsStore();
      settingsStore.displaySettings.restaurantId = data.restaurantId;
      console.log('Connection event:', data);
      socket.value?.onAny((ev) => console.log('Event received:', ev));
    });

    // Connect to the socket
    socket.value.connect();
  };

  // Cleanup on component unmount
  onUnmounted(() => {
    if (socket.value) {
      socket.value.disconnect();
      console.log('Socket connection closed on unmount.');
    }
  });

  return { connectSocket };
};
