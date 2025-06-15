import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useThemeStore = defineStore('theme', () => {
  // State
  const isDark = ref(false);

  // Initialize theme from localStorage or system preference
  const initTheme = () => {
    // Check if theme is stored in localStorage
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      isDark.value = storedTheme === 'dark';
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      isDark.value = prefersDark;
    }
    
    // Apply theme
    applyTheme();
  };

  // Toggle theme
  const toggleTheme = () => {
    isDark.value = !isDark.value;
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
    applyTheme();
  };

  // Apply theme to document
  const applyTheme = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Watch for system preference changes
  if (process.client) {
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
  }

  return {
    isDark,
    initTheme,
    toggleTheme
  };
});