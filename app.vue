<template>
  <div class="min-h-screen transition-colors duration-200 dark:bg-gray-900 dark:text-white">
    <NuxtPage />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useThemeStore } from '~/stores/theme';

const themeStore = useThemeStore();

// Initialize theme on app load
onMounted(() => {
  themeStore.initTheme();
});
</script>
