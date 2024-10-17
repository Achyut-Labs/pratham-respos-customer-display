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
import { useWebSocket } from '@vueuse/core';

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

  const displayInitialSetup = (data: { restaurantId: number }) => {
    const settingsStore = useMediaSettingsStore();
    settingsStore.displaySettings.restaurantId = data.restaurantId;
  };

  const onSocketConnect = () => {
    Loading.show();
    console.log('Connected to the local socket');
    setTimeout(() => {
      router.push('/');
      Loading.hide();
    }, 1000);
  };

  const onConnectError = () => {
    console.error('Local Socket Connection error:');
    router.push('/start');
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
    socket.value.on('connect', onSocketConnect);

    socket.value.on('connect_error', onConnectError);

    socket.value.on('disconnect', () => {
      console.log('Disconnected from the local socket');
    });

    // Listen for events
    socket.value.on('update-cart', updateCart);
    socket.value.on('customer-display-settings', updateMediaSettings);
    socket.value.on('setup', displayInitialSetup);

    // Connect to the socket
    socket.value.connect();
  };

  const { open, status, close } = useWebSocket(`ws://192.168.31.246:${3000}`, {
    immediate: false,
    autoReconnect: true,
    onMessage(ws, event) {
      try {
        const { eventName, data } = JSON.parse(event.data);
        if (eventName) {
          switch (eventName) {
            case 'update-cart':
              updateCart(data);
              break;
            case 'customer-display-settings':
              updateMediaSettings(data);
              break;
            case 'setup':
              const settingsStore = useMediaSettingsStore();
              settingsStore.displaySettings.restaurantId = data.restaurantId;
              break;

            default:
              break;
          }
        }
      } catch (error) {
        // console.log(error);
      }
      console.log(event.data);
    },
    onConnected: onSocketConnect,
    onError: onConnectError,
  });

  // Cleanup on component unmount
  onUnmounted(() => {
    if (socket.value) {
      socket.value.disconnect();
      console.log('Socket connection closed on unmount.');
    }
  });

  const connect = () => {
    if (Platform.is.android) {
      if (status.value === 'OPEN') close();
      open();
      return;
    }

    connectSocket();
  };

  return { connect };
};
