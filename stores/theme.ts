import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useThemeStore = defineStore('theme', () => {
  // State
  const isDark = ref(false);
  // Track if the watcher has been set up
  let watcherInitialized = false;

  // Initialize theme from localStorage or system preference
  const initTheme = () => {
    try {
      // Check if theme is stored in localStorage
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme) {
        isDark.value = storedTheme === 'dark';
      } else if (process.client) {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        isDark.value = prefersDark;
      }

      // Apply theme
      if (process.client) {
        applyTheme();

        // Set up watcher for system preference changes if not already initialized
        if (!watcherInitialized) {
          watch(
            () => window.matchMedia('(prefers-color-scheme: dark)').matches,
            (newValue) => {
              // Only update if user hasn't set a preference
              if (!localStorage.getItem('theme')) {
                isDark.value = newValue;
                applyTheme();
              }
            }
          );
          watcherInitialized = true;
        }
      }
    } catch (error) {
      console.error('Failed to initialize theme:', error);
    }
  };

  // Toggle theme
  const toggleTheme = () => {
    try {
      isDark.value = !isDark.value;
      if (process.client) {
        localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
        applyTheme();
      }
    } catch (error) {
      console.error('Failed to toggle theme:', error);
    }
  };

  // Apply theme to document
  const applyTheme = () => {
    try {
      if (process.client) {
        if (isDark.value) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    } catch (error) {
      console.error('Failed to apply theme:', error);
    }
  };

  return {
    isDark,
    initTheme,
    toggleTheme
  };
});
