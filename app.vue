<template>
  <div class="min-h-screen flex flex-col transition-colors duration-200 dark:bg-gray-900 dark:text-white">
    <UApp>
      <main class="flex-1">
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </main>
      <UToaster position="bottom-right" />
    </UApp>
  </div>
</template>

<script setup lang="ts">
</script>