export default defineNuxtPlugin({
  name: 'store-init-plugin',
  enforce: 'pre', // Run before other plugins
  setup(nuxtApp) {
    // Make sure Pinia is initialized by accessing it through nuxtApp
    const pinia = nuxtApp.$pinia;

    // Only run on client-side to avoid localStorage errors on server
    if (process.client) {
      // Use a safe initialization approach with try-catch blocks
      nuxtApp.hook('app:created', () => {
        try {
          // Initialize user store
          const userStore = useUserStore();
          userStore.init();

          // Initialize theme store
          const themeStore = useThemeStore();
          themeStore.initTheme();

          // Other stores can be initialized here if they have init methods
          // For example:
          // try {
          //   const eventStore = useEventStore();
          //   if (typeof eventStore.init === 'function') eventStore.init();
          // } catch (error) {
          //   console.error('Failed to initialize event store:', error);
          // }

          // try {
          //   const giftStore = useGiftStore();
          //   if (typeof giftStore.init === 'function') giftStore.init();
          // } catch (error) {
          //   console.error('Failed to initialize gift store:', error);
          // }

          // try {
          //   const groupStore = useGroupStore();
          //   if (typeof groupStore.init === 'function') groupStore.init();
          // } catch (error) {
          //   console.error('Failed to initialize group store:', error);
          // }
        } catch (error) {
          console.error('Failed to initialize stores:', error);
        }
      });
    }
  }
});
