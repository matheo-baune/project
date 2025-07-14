<template>
  <nav class="bg-white shadow dark:bg-gray-800 dark:text-white transition-colors duration-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <NuxtLink to="/dashboard" class="text-xl font-bold text-indigo-600 dark:text-indigo-400">
              {{ $t('navbar.appName') }}
            </NuxtLink>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <!-- Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" -->
            <NuxtLink 
              to="/dashboard" 
              class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium dark:text-gray-300 dark:hover:text-white"
              :class="{ 'border-indigo-500 text-gray-900 bg-indigo-50 px-3 rounded-t-md dark:bg-indigo-900 dark:bg-opacity-50 dark:text-white': $route.path === '/dashboard' }"
            >
              <span class="flex items-center">
                <span v-if="$route.path === '/dashboard'" class="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                {{ $t('navbar.dashboard') }}
              </span>
            </NuxtLink>
            <NuxtLink 
              v-if="userStore.isAdmin"
              to="/admin" 
              class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium dark:text-gray-300 dark:hover:text-white"
              :class="{ 'border-indigo-500 text-gray-900 bg-indigo-50 px-3 rounded-t-md dark:bg-indigo-900 dark:bg-opacity-50 dark:text-white': $route.path.startsWith('/admin') }"
            >
              <span class="flex items-center">
                <span v-if="$route.path.startsWith('/admin')" class="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                {{ $t('navbar.admin') }}
              </span>
            </NuxtLink>
          </div>
        </div>
        <div class="hidden sm:ml-6 sm:flex sm:items-center">
          <!-- Theme toggle -->
          <button 
            @click="themeStore.toggleTheme"
            class="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:text-gray-300 dark:hover:text-white"
            :title="themeStore.isDark ? $t('navbar.switchToLightMode') : $t('navbar.switchToDarkMode')"
          >
            <!-- Sun icon for dark mode -->
            <svg 
              v-if="themeStore.isDark" 
              xmlns="http://www.w3.org/2000/svg" 
              class="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <!-- Moon icon for light mode -->
            <svg 
              v-else 
              xmlns="http://www.w3.org/2000/svg" 
              class="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>

          <!-- Language switcher -->
          <div class="ml-3">
            <LanguageSwitcher />
          </div>

          <!-- Profile dropdown -->
          <div class="ml-3 relative">
            <div>
              <button 
                @click="isProfileMenuOpen = !isProfileMenuOpen" 
                type="button" 
                class="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" 
                id="user-menu-button" 
                aria-expanded="false" 
                aria-haspopup="true"
              >
                <span class="sr-only">{{ $t('navbar.openUserMenu') }}</span>
                <div class="h-8 w-8 rounded-full overflow-hidden">
                  <img v-if="user?.avatar" :src="user.avatar" alt="User avatar" class="h-full w-full object-cover" />
                  <div v-else class="h-full w-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-semibold">
                    {{ userInitials }}
                  </div>
                </div>
              </button>
            </div>

            <!-- Dropdown menu -->
            <div 
              v-if="isProfileMenuOpen" 
              class="origin-top-right z-10 absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu" 
              aria-orientation="vertical" 
              aria-labelledby="user-menu-button" 
              tabindex="-1"
            >
              <div class="px-4 py-2 text-xs text-gray-500">
                {{ $t('navbar.signedInAs') }} <span class="font-medium">{{ user?.email }}</span>
              </div>
              <div class="border-t border-gray-100"></div>
              <NuxtLink 
                to="/profile" 
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                role="menuitem" 
                tabindex="-1" 
                id="user-menu-item-0"
              >
                {{ $t('navbar.yourProfile') }}
              </NuxtLink>
              <a 
                href="#" 
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                role="menuitem" 
                tabindex="-1" 
                id="user-menu-item-1"
              >
                {{ $t('navbar.settings') }}
              </a>
              <a 
                href="#" 
                @click.prevent="logout" 
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                role="menuitem" 
                tabindex="-1" 
                id="user-menu-item-2"
              >
                {{ $t('navbar.signOut') }}
              </a>
            </div>
          </div>
        </div>
        <div class="-mr-2 flex items-center sm:hidden">
          <!-- Mobile menu button -->
          <button 
            @click="isMobileMenuOpen = !isMobileMenuOpen" 
            type="button" 
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500" 
            aria-controls="mobile-menu" 
            aria-expanded="false"
          >
            <span class="sr-only">{{ $t('navbar.openMenu') }}</span>
            <!-- Icon when menu is closed -->
            <svg 
              v-if="!isMobileMenuOpen" 
              class="block h-6 w-6" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <!-- Icon when menu is open -->
            <svg 
              v-else 
              class="block h-6 w-6" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu, show/hide based on menu state. -->
    <div v-if="isMobileMenuOpen" class="sm:hidden" id="mobile-menu">
      <div class="pt-2 pb-3 space-y-1">
        <!-- Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" -->
        <NuxtLink 
          to="/dashboard" 
          class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          :class="{ 'bg-indigo-100 border-indigo-500 text-indigo-700 font-semibold': $route.path === '/dashboard' }"
        >
          <div class="flex items-center">
            <span v-if="$route.path === '/dashboard'" class="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
            {{ $t('navbar.dashboard') }}
          </div>
        </NuxtLink>
        <NuxtLink 
          v-if="userStore.isAdmin"
          to="/admin" 
          class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          :class="{ 'bg-indigo-100 border-indigo-500 text-indigo-700 font-semibold': $route.path.startsWith('/admin') }"
        >
          <div class="flex items-center">
            <span v-if="$route.path.startsWith('/admin')" class="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
            Admin
          </div>
        </NuxtLink>
      </div>
      <div class="pt-4 pb-3 border-t border-gray-200">
        <div class="flex items-center px-4">
          <div class="flex-shrink-0">
            <div class="h-10 w-10 rounded-full overflow-hidden">
              <img v-if="user?.avatar" :src="user.avatar" alt="User avatar" class="h-full w-full object-cover" />
              <div v-else class="h-full w-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-semibold">
                {{ userInitials }}
              </div>
            </div>
          </div>
          <div class="ml-3">
            <div class="text-base font-medium text-gray-800">{{ user?.name }}</div>
            <div class="text-sm font-medium text-gray-500">{{ user?.email }}</div>
          </div>
        </div>
        <div class="mt-3 space-y-1">
          <NuxtLink 
            to="/profile" 
            class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700" 
          >
            Your Profile
          </NuxtLink>
          <a 
            href="#" 
            class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700" 
          >
            Settings
          </a>
          <button 
            @click="themeStore.toggleTheme"
            class="w-full text-left block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700" 
          >
            {{ themeStore.isDark ? 'Light Mode' : 'Dark Mode' }}
          </button>
          <a 
            href="#" 
            @click.prevent="logout" 
            class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700" 
          >
            Sign out
          </a>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore, useThemeStore } from '~/stores';
import LanguageSwitcher from '~/components/LanguageSwitcher.vue';

const router = useRouter();
const userStore = useUserStore();
const themeStore = useThemeStore();

// Initialize theme
onMounted(() => {
  themeStore.initTheme();
});

const isProfileMenuOpen = ref(false);
const isMobileMenuOpen = ref(false);

// Get user from store
const user = computed(() => userStore.user);

// Get user initials for avatar
const userInitials = computed(() => {
  if (!user.value?.firstname) return '?';

  const firstNamePart = user.value.firstname.charAt(0).toUpperCase();
  const lastNamePart = user.value.lastname.charAt(0).toUpperCase();
  return firstNamePart + lastNamePart;
});

// Handle logout
const logout = async () => {
  await userStore.logout();
  router.push('/login');
};

// Close menus when clicking outside
const closeMenus = () => {
  isProfileMenuOpen.value = false;
  isMobileMenuOpen.value = false;
};

// Add click outside listener
onMounted(() => {
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    if (!target.closest('#user-menu-button') && !target.closest('[role="menu"]')) {
      isProfileMenuOpen.value = false;
    }

    if (!target.closest('[aria-controls="mobile-menu"]') && !target.closest('#mobile-menu')) {
      isMobileMenuOpen.value = false;
    }
  });
});

// Remove listener on unmount
onUnmounted(() => {
  document.removeEventListener('click', closeMenus);
});
</script>
