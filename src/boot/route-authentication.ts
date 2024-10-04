import { boot } from 'quasar/wrappers';
import { useMediaSettingsStore } from 'src/stores/media-settings-store';

export default boot(({ router }) => {
  router.beforeEach((to, _from, next) => {
    // 1. check for restaurant configurations
    const settingsStore = useMediaSettingsStore();
    console.log(to.fullPath);

    if (
      (!settingsStore.socketConfig.ip ||
        !settingsStore.socketConfig.port ||
        !settingsStore.displaySettings.restaurantId) &&
      to.fullPath !== '/start'
    ) {
      next('/start');
    } else {
      next();
    }
  });
});
