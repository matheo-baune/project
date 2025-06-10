<template>
  <nav class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <NuxtLink to="/dashboard" class="text-xl font-bold text-indigo-600">
              Gift List Manager
            </NuxtLink>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <!-- Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" -->
            <NuxtLink 
              to="/dashboard" 
              class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              :class="{ 'border-indigo-500 text-gray-900': $route.path === '/dashboard' }"
            >
              Dashboard
            </NuxtLink>
          </div>
        </div>
        <div class="hidden sm:ml-6 sm:flex sm:items-center">
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
                <span class="sr-only">Open user menu</span>
                <div class="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-semibold">
                  {{ userInitials }}
                </div>
              </button>
            </div>

            <!-- Dropdown menu -->
            <div 
              v-if="isProfileMenuOpen" 
              class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" 
              role="menu" 
              aria-orientation="vertical" 
              aria-labelledby="user-menu-button" 
              tabindex="-1"
            >
              <div class="px-4 py-2 text-xs text-gray-500">
                Signed in as <span class="font-medium">{{ user?.email }}</span>
              </div>
              <div class="border-t border-gray-100"></div>
              <a 
                href="#" 
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                role="menuitem" 
                tabindex="-1" 
                id="user-menu-item-0"
              >
                Your Profile
              </a>
              <a 
                href="#" 
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                role="menuitem" 
                tabindex="-1" 
                id="user-menu-item-1"
              >
                Settings
              </a>
              <a 
                href="#" 
                @click.prevent="logout" 
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                role="menuitem" 
                tabindex="-1" 
                id="user-menu-item-2"
              >
                Sign out
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
            <span class="sr-only">Open main menu</span>
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
          :class="{ 'bg-indigo-50 border-indigo-500 text-indigo-700': $route.path === '/dashboard' }"
        >
          Dashboard
        </NuxtLink>
      </div>
      <div class="pt-4 pb-3 border-t border-gray-200">
        <div class="flex items-center px-4">
          <div class="flex-shrink-0">
            <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-semibold">
              {{ userInitials }}
            </div>
          </div>
          <div class="ml-3">
            <div class="text-base font-medium text-gray-800">{{ user?.name }}</div>
            <div class="text-sm font-medium text-gray-500">{{ user?.email }}</div>
          </div>
        </div>
        <div class="mt-3 space-y-1">
          <a 
            href="#" 
            class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100" 
          >
            Your Profile
          </a>
          <a 
            href="#" 
            class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100" 
          >
            Settings
          </a>
          <a 
            href="#" 
            @click.prevent="logout" 
            class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100" 
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
import { useUserStore } from '~/stores/user';

const router = useRouter();
const userStore = useUserStore();

const isProfileMenuOpen = ref(false);
const isMobileMenuOpen = ref(false);

// Get user from store
const user = computed(() => userStore.user);

// Get user initials for avatar
const userInitials = computed(() => {
  if (!user.value?.name) return '?';

  const nameParts = user.value.name.split(' ');
  if (nameParts.length === 1) {
    return nameParts[0].charAt(0).toUpperCase();
  }

  return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
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
