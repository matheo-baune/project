import { useUserStore } from '~/stores';

// This plugin is kept for backward compatibility
// Store initialization is now handled by store-init.ts plugin
export default defineNuxtPlugin({
  name: 'auth-plugin',
  enforce: 'pre', // Run before other plugins
  async setup() {
    // Authentication logic can be added here if needed
    // User store initialization is now handled by store-init.ts
  }
});
