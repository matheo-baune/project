<template>
  <div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            </div>

            <!-- Admin not authorized -->
            <div v-if="!userStore.isAdmin" class="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                <div class="flex">
                    <div class="shrink-0">
                        <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                             fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                  clip-rule="evenodd"/>
                        </svg>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-red-700">
                            You do not have permission to access the admin dashboard. Please log in as an admin user.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Admin Dashboard Content -->
            <div v-else>
                <div class="bg-white shadow-sm overflow-hidden sm:rounded-lg mb-6">
                    <div class="px-4 py-5 sm:px-6">
                        <h3 class="text-lg leading-6 font-medium text-gray-900">Admin Controls</h3>
                        <p class="mt-1 max-w-2xl text-sm text-gray-500">Manage users, groups, events, and gifts.</p>
                    </div>
                    <div class="border-t border-gray-200">
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
                            <!-- Users Management Card -->
                            <div class="bg-white overflow-hidden shadow-sm rounded-lg">
                                <div class="px-4 py-5 sm:p-6">
                                    <div class="flex items-center">
                                        <div class="shrink-0 bg-indigo-500 rounded-md p-3">
                                            <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg"
                                                 fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                                            </svg>
                                        </div>
                                        <div class="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt class="text-sm font-medium text-gray-500 truncate">Users</dt>
                                                <dd>
                                                    <div class="text-lg font-medium text-gray-900">Manage Users</div>
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-gray-50 px-4 py-4 sm:px-6">
                                    <div class="text-sm">
                                        <NuxtLink to="/admin/users"
                                                  class="font-medium text-indigo-600 hover:text-indigo-500">
                                            View all users <span aria-hidden="true">&rarr;</span>
                                        </NuxtLink>
                                    </div>
                                </div>
                            </div>

                            <!-- Groups Management Card -->
                            <div class="bg-white overflow-hidden shadow-sm rounded-lg">
                                <div class="px-4 py-5 sm:p-6">
                                    <div class="flex items-center">
                                        <div class="shrink-0 bg-green-500 rounded-md p-3">
                                            <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg"
                                                 fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                                            </svg>
                                        </div>
                                        <div class="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt class="text-sm font-medium text-gray-500 truncate">Groups</dt>
                                                <dd>
                                                    <div class="text-lg font-medium text-gray-900">Manage Groups</div>
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-gray-50 px-4 py-4 sm:px-6">
                                    <div class="text-sm">
                                        <NuxtLink to="/admin/groups"
                                                  class="font-medium text-indigo-600 hover:text-indigo-500">
                                            View all groups <span aria-hidden="true">&rarr;</span>
                                        </NuxtLink>
                                    </div>
                                </div>
                            </div>

                            <!-- Events Management Card -->
                            <div class="bg-white overflow-hidden shadow-sm rounded-lg">
                                <div class="px-4 py-5 sm:p-6">
                                    <div class="flex items-center">
                                        <div class="shrink-0 bg-yellow-500 rounded-md p-3">
                                            <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg"
                                                 fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                            </svg>
                                        </div>
                                        <div class="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt class="text-sm font-medium text-gray-500 truncate">Events</dt>
                                                <dd>
                                                    <div class="text-lg font-medium text-gray-900">Manage Events</div>
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-gray-50 px-4 py-4 sm:px-6">
                                    <div class="text-sm">
                                        <NuxtLink to="/admin/events"
                                                  class="font-medium text-indigo-600 hover:text-indigo-500">
                                            View all events <span aria-hidden="true">&rarr;</span>
                                        </NuxtLink>
                                    </div>
                                </div>
                            </div>

                            <!-- Gifts Management Card -->
                            <div class="bg-white overflow-hidden shadow-sm rounded-lg">
                                <div class="px-4 py-5 sm:p-6">
                                    <div class="flex items-center">
                                        <div class="shrink-0 bg-red-500 rounded-md p-3">
                                            <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg"
                                                 fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                      d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/>
                                            </svg>
                                        </div>
                                        <div class="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt class="text-sm font-medium text-gray-500 truncate">Gifts</dt>
                                                <dd>
                                                    <div class="text-lg font-medium text-gray-900">Manage Gifts</div>
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-gray-50 px-4 py-4 sm:px-6">
                                    <div class="text-sm">
                                        <NuxtLink to="/admin/gifts"
                                                  class="font-medium text-indigo-600 hover:text-indigo-500">
                                            View all gifts <span aria-hidden="true">&rarr;</span>
                                        </NuxtLink>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quick Stats -->
                <div class="bg-white shadow-sm overflow-hidden sm:rounded-lg">
                    <div class="px-4 py-5 sm:px-6">
                        <h3 class="text-lg leading-6 font-medium text-gray-900">Quick Stats</h3>
                        <p class="mt-1 max-w-2xl text-sm text-gray-500">Overview of system data.</p>
                    </div>
                    <div class="border-t border-gray-200">
                        <dl>
                            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt class="text-sm font-medium text-gray-500">Total Users</dt>
                                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ stats.users }}</dd>
                            </div>
                            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt class="text-sm font-medium text-gray-500">Total Groups</dt>
                                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ stats.groups }}</dd>
                            </div>
                            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt class="text-sm font-medium text-gray-500">Total Events</dt>
                                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ stats.events }}</dd>
                            </div>
                            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt class="text-sm font-medium text-gray-500">Total Gifts</dt>
                                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ stats.gifts }}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import {
    useUserStore,
    useGroupStore,
    useEventStore,
    useGiftStore
} from '~/stores';

const router = useRouter();
const userStore = useUserStore();
const groupStore = useGroupStore();
const eventStore = useEventStore();
const giftStore = useGiftStore();

// Stats for the admin dashboard
const stats = ref({
    users: 0,
    groups: 0,
    events: 0,
    gifts: 0
});

// Initialize the admin dashboard
onMounted(async () => {
    if (!userStore.isLoggedIn) {
        await router.push('/login');
        return;
    }

    if (!userStore.isAdmin) {
        await router.push('/dashboard');
        return;
    }

    // Fetch stats
    await fetchStats();
});

// Fetch stats for the dashboard
const fetchStats = async () => {
    try {
        // Get groups count from the store
        const groups = await groupStore.fetchGroups();
        stats.value.groups = groups.length;

        const users = await userStore.fetchAllUsers();
        stats.value.users = users.length;

        const events = await eventStore.fetchAllEvents();
        stats.value.events = events.length;

        const gifts = await giftStore.fetchAllGifts();
        stats.value.gifts = gifts.length;
    } catch (err) {
        console.error('Failed to fetch stats:', err);
    }
};
</script>
