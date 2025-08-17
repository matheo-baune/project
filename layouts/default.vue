<template>
  <div class="min-h-screen flex flex-col transition-colors duration-200 dark:bg-gray-900 dark:text-white">
    <Navbar />
    <main class="flex-1">
      <slot />
    </main>
    <UiFooter />
  </div>
</template>

<script setup lang="ts">
import Navbar from '~/components/ui/Navbar.vue'
import UiFooter from '~/components/ui/Footer.vue'
</script>
