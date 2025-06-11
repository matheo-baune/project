<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div class="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Gift List Manager</h1>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">Create and share gift lists with your friends and family</p>
      </div>
      <div class="mt-8">
        <NuxtLink 
          to="/login" 
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-600 dark:focus:ring-offset-gray-900"
        >
          Get Started
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// This is a simple landing page that redirects to the login page
// You could also use a middleware or a script to redirect directly:

// Uncomment this to automatically redirect to login page
// onMounted(() => {
//   navigateTo('/login')
// })
</script>
