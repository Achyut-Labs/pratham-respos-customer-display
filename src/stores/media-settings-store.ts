import { defineStore } from 'pinia'
import { Loading } from 'quasar'
import { api } from 'src/boot/axios'
import { aspectRatiosList, files, GetFilesParams } from 'src/types/mediaSettings'

interface State {
  restaurantId: number | null
  screenSize: number
  group: number | null
  files: files,
  aspectRatios: aspectRatiosList
  slideTransitionInterval: number
}

export const useMediaSettingsStore = defineStore('customer', {
  state: (): State => ({
    restaurantId: localStorage.getItem('RestaurantId') ? Number(localStorage.getItem('RestaurantId')) : null,
    screenSize: localStorage.getItem('ScreenSize') ? Number(localStorage.getItem('ScreenSize')) : 50,
    group: localStorage.getItem('ScreenSize') ? Number(localStorage.getItem('ScreenSize')) : null,
    slideTransitionInterval: localStorage.getItem('SlideTransitionInterval') ? Number(localStorage.getItem('SlideTransitionInterval')) : 5,
    files: [],
    aspectRatios: []

  }),
  getters: {},
  actions: {
    async getCustomerDisplayFile(params: GetFilesParams) {
      try {
        Loading.show()
        const res: files | null = await api.get('customer-display/files/list/public', {params})
        // notifications.successNotify('Customer is Registered Successfully!')
        this.files = res
        return res
      } catch (error) {
        console.error('API call error!')
        // Promise.reject();
      } finally {
        Loading.hide()
      }
    },

    async getAspectRatios() {
      try {
        Loading.show()
        const res: aspectRatiosList | null = await api.get('aspect-ratios')
        // notifications.successNotify('Customer is Registered Successfully!')
        this.aspectRatios = res
        return res
      } catch (error) {
        console.error('API call error!')
        // Promise.reject();
      } finally {
        Loading.hide()
      }
    }
  }
  // persist: true
})
