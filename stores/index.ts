// This file centralizes all store exports for easier imports throughout the application

// Re-export all stores without importing them first to avoid duplicate imports
export { useUserStore } from './user';
export { useThemeStore } from './theme';
export { useGroupStore } from './group';
export { useEventStore } from './event';
export { useGiftStore } from './gift';

// You can also add utility functions related to stores here
// For example, a function to reset all stores

/**
 * Reset all stores to their initial state
 * Useful for logout or testing
 */
export function resetAllStores() {
  try {
    // Import the store functions from their respective modules
    // This ensures we're using the correct imports and avoiding duplicates
    const { useUserStore } = require('./user');
    const { useThemeStore } = require('./theme');
    const { useGroupStore } = require('./group');
    const { useEventStore } = require('./event');
    const { useGiftStore } = require('./gift');

    const userStore = useUserStore();
    const themeStore = useThemeStore();
    const groupStore = useGroupStore();
    const eventStore = useEventStore();
    const giftStore = useGiftStore();

    // Reset each store if they have a reset method
    if (typeof userStore.$reset === 'function') userStore.$reset();
    if (typeof themeStore.$reset === 'function') themeStore.$reset();
    if (typeof groupStore.$reset === 'function') groupStore.$reset();
    if (typeof eventStore.$reset === 'function') eventStore.$reset();
    if (typeof giftStore.$reset === 'function') giftStore.$reset();
  } catch (error) {
    console.error('Failed to reset stores:', error);
    // If Pinia is not initialized, we can't reset the stores
    // This is a graceful fallback
  }
}
