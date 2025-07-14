<template>
  <div class="min-h-screen transition-colors duration-200 dark:bg-gray-900 dark:text-white">
    <NuxtPage />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useThemeStore, useUserStore } from '~/stores/index.js';

// Use ref to store the store instances
const themeStore = ref(null);
const userStore = ref(null);

// Initialize stores on app load
onMounted(() => {
  try {
    // Access the stores only after the component is mounted
    themeStore.value = useThemeStore();
    themeStore.value.initTheme();

    // Initialize user store
    userStore.value = useUserStore();
    userStore.value.init();
  } catch (error) {
    console.error('Failed to initialize stores:', error);
  }
});
</script>
