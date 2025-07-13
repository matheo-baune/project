<template>
  <div class="relative inline-block text-left">
    <button 
      @click="isOpen = !isOpen" 
      type="button" 
      class="inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      :aria-expanded="isOpen"
    >
      {{ currentLocale.name }}
      <svg class="ml-2 -mr-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
      </svg>
    </button>

    <div 
      v-if="isOpen" 
      class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
      role="menu"
      aria-orientation="vertical"
      @click.outside="isOpen = false"
    >
      <div class="py-1" role="none">
        <button
          v-for="locale in availableLocales"
          :key="locale.code"
          @click="switchLanguage(locale.code)"
          class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          role="menuitem"
        >
          {{ locale.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale, locales } = useI18n();
const isOpen = ref(false);

const availableLocales = computed(() => {
  return locales.value.filter(l => l.code !== locale.value);
});

const currentLocale = computed(() => {
  return locales.value.find(l => l.code === locale.value);
});

const switchLanguage = (code) => {
  locale.value = code;
  isOpen.value = false;
};
</script>