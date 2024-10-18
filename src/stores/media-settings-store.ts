import { defineStore } from 'pinia';
import { Loading } from 'quasar';
import { api } from 'src/boot/axios';
import {
  aspectRatiosList,
  files,
  GetFilesParams,
} from 'src/types/mediaSettings';

export interface ICustomerDisplaySettings {
  restaurantId: number;
  screenDivision: number;
  groupToDisplay: number;
  slideTransitionInterval: number;
  lineItemFontSize: string;
  modifiersFontSize: string;
}

export interface SocketConfig {
  ip: string;
  port: number;
}
interface State {
  socketConfig: SocketConfig;
  displaySettings: ICustomerDisplaySettings;
  files: files;
  aspectRatios: aspectRatiosList;
}

export const useMediaSettingsStore = defineStore('mediaSettings', {
  state: (): State => ({
    socketConfig: { ip: '127.0.0.1', port: 3000 },
    displaySettings: {
      restaurantId: 0,
      groupToDisplay: 1,
      screenDivision: 50,
      slideTransitionInterval: 5,
      lineItemFontSize: '14px',
      modifiersFontSize: '12px',
    },
    files: [],
    aspectRatios: [],
  }),
  getters: {},
  actions: {
    async getCustomerDisplayFile(params: GetFilesParams) {
      try {
        // Loading.show();
        const res: files | null = await api.get(
          'customer-display/files/list/public',
          { params }
        );
        // notifications.successNotify('Customer is Registered Successfully!')
        this.files = res;
        return res;
      } catch (error) {
        console.error('API call error!');
        // Promise.reject();
      } finally {
        Loading.hide();
      }
    },

    async getAspectRatios() {
      try {
        // Loading.show();
        const res: aspectRatiosList | null = await api.get('aspect-ratios');
        // notifications.successNotify('Customer is Registered Successfully!')
        if (res) {
          this.aspectRatios = res;
        }
        return res;
      } catch (error) {
        console.error('API call error!');
        // Promise.reject();
      } finally {
        Loading.hide();
      }
    },
  },
  persist: true,
});
