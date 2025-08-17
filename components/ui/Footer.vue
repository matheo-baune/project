<template>
  <footer class="border-t border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 backdrop-blur">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-sm text-gray-600 dark:text-gray-400 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div>
        © {{ new Date().getFullYear() }} {{ t('common.appName') }}. All rights reserved.
      </div>
      <div class="flex items-center gap-4">
        <NuxtLink to="/" class="hover:text-gray-900 dark:hover:text-gray-200">{{ t('navbar.home') }}</NuxtLink>
        <NuxtLink to="/dashboard" class="hover:text-gray-900 dark:hover:text-gray-200">{{ t('navbar.dashboard') }}</NuxtLink>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
// Simple footer component
</script>
