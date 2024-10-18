import { Loading } from 'quasar';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { EmitOrderCartData } from 'src/types/cart';
import {
  ICustomerDisplaySettings,
  useMediaSettingsStore,
} from 'src/stores/media-settings-store';
import { storeToRefs } from 'pinia';
import { useCartStore } from 'src/stores/cart';
import { useWebSocket } from '@vueuse/core';

export enum SOCKET_EVENTS {
  UPDATE_CART = 'update-cart',
  ORDER_PAID = 'order-paid',
  UPDATE_CUSTOMER_DISPLAY_SETTINGS = 'customer-display-settings',
  SETUP = 'setup',
}

export interface UseSocketOptions {
  onMessage?: (eventName: string, data: any) => void;
}

export const useSocket = (options: UseSocketOptions = {}) => {
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
    console.log(data, '------------------ event received');
    cartStore.cartItems = {
      ...data,
      surcharge_amount: data?.surcharge_amount ?? 0,
      surcharge_type: data?.surcharge_type ?? 0,
      discount: data?.discount ?? 0,
    };
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

  const socketUrl = computed(() => `ws://${socketConfig.value.ip}:${3000}`);
  const { open, status, close } = useWebSocket(socketUrl, {
    immediate: false,
    autoReconnect: true,
    onMessage(ws, event) {
      try {
        const { eventName, data } = JSON.parse(event.data);

        if (options.onMessage) {
          options?.onMessage(eventName, data);
        }

        if (eventName) {
          switch (eventName) {
            case SOCKET_EVENTS.UPDATE_CART:
              updateCart(data);
              break;
            case SOCKET_EVENTS.UPDATE_CUSTOMER_DISPLAY_SETTINGS:
              updateMediaSettings(data);
              break;
            case SOCKET_EVENTS.SETUP:
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

  const connect = () => {
    if (status.value === 'OPEN') close();
    open();
  };

  return { connect };
};
