<template>
    <div>
        <Navbar/>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="flex justify-between items-center mb-6">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">User Management</h1>
                    <p class="mt-1 text-sm text-gray-500">
                        Manage user accounts and permissions
                    </p>
                </div>
                <div>
                    <NuxtLink to="/admin" class="mr-4 text-indigo-600 hover:text-indigo-900">
                        Back to Dashboard
                    </NuxtLink>
                    <button
                        @click="showCreateModal = true"
                        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                        </svg>
                        Add User
                    </button>
                </div>
            </div>

            <!-- Admin not authorized -->
            <div v-if="!userStore.isAdmin" class="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                <div class="flex">
                    <div class="flex-shrink-0">
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

            <!-- Loading state -->
            <div v-else-if="loading" class="flex justify-center items-center py-12">
                <svg class="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                     viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>

            <!-- Error state -->
            <div v-else-if="error" class="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                             fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                  clip-rule="evenodd"/>
                        </svg>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-red-700">
                            {{ error }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Users Table -->
            <div v-else class="bg-white shadow overflow-hidden sm:rounded-lg">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <caption class="sr-only">User Management Table</caption>
                        <thead class="bg-gray-50">
                        <tr>
                            <th scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                User
                            </th>
                            <th scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Role
                            </th>
                            <th scope="col"
                                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="user in users" :key="user.id">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <div class="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
                                        <img v-if="user.avatar" :src="user.avatar" alt="User avatar"
                                             class="h-full w-full object-cover"/>
                                        <div v-else
                                             class="h-full w-full flex items-center justify-center bg-indigo-100 text-indigo-800 text-sm font-semibold">
                                            {{ getUserInitials(user) }}
                                        </div>
                                    </div>
                                    <div class="ml-4">
                                        <div class="text-sm font-medium text-gray-900">
                                            {{ user.name }}
                                        </div>
                                        <div class="text-sm text-gray-500">
                                            ID: {{ user.id }}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-900">{{ user.email }}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                  <span
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="user.isAdmin ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'"
                  >
                    {{ user.isAdmin ? 'Admin' : 'User' }}
                  </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    @click="handleEditUser(user)"
                                    class="text-indigo-600 hover:text-indigo-900 mr-4"
                                >
                                    Edit
                                </button>
                                <button
                                    @click="handleDeleteUser(user)"
                                    class="text-red-600 hover:text-red-900"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Create/Edit User Modal -->
        <div v-if="showCreateModal || showEditModal" class="fixed z-10 inset-0 overflow-y-auto"
             aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <!-- Background overlay -->
                <div
                    class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    aria-hidden="true"
                    @click="closeModals"
                ></div>

                <!-- Modal panel -->
                <div
                    class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div class="sm:flex sm:items-start">
                            <div
                                class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                </svg>
                            </div>
                            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                    {{ showEditModal ? 'Edit User' : 'Create New User' }}
                                </h3>
                                <div class="mt-4">
                                    <form @submit.prevent="handleSubmitUser">
                                        <!-- Name -->
                                        <div>
                                            <label for="name" class="block text-sm font-medium text-gray-700">
                                                Name *
                                            </label>
                                            <div class="mt-1">
                                                <input
                                                    type="text"
                                                    name="name"
                                                    id="name"
                                                    v-model="userForm.name"
                                                    required
                                                    class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                        </div>

                                        <!-- Email -->
                                        <div class="mt-4">
                                            <label for="email" class="block text-sm font-medium text-gray-700">
                                                Email *
                                            </label>
                                            <div class="mt-1">
                                                <input
                                                    type="email"
                                                    name="email"
                                                    id="email"
                                                    v-model="userForm.email"
                                                    required
                                                    class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                    placeholder="john@example.com"
                                                />
                                            </div>
                                        </div>

                                        <!-- Password (only for new users) -->
                                        <div v-if="!showEditModal" class="mt-4">
                                            <label for="password" class="block text-sm font-medium text-gray-700">
                                                Password *
                                            </label>
                                            <div class="mt-1">
                                                <input
                                                    type="password"
                                                    name="password"
                                                    id="password"
                                                    v-model="userForm.password"
                                                    required
                                                    class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                />
                                            </div>
                                        </div>

                                        <!-- Admin Role -->
                                        <div class="mt-4">
                                            <div class="flex items-center">
                                                <input
                                                    id="admin-role"
                                                    name="admin-role"
                                                    type="checkbox"
                                                    v-model="userForm.isAdmin"
                                                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                />
                                                <label for="admin-role" class="ml-2 block text-sm text-gray-900">
                                                    Admin privileges
                                                </label>
                                            </div>
                                            <p class="mt-1 text-xs text-gray-500">
                                                Admins have full access to all system features and management
                                                capabilities.
                                            </p>
                                        </div>

                                        <!-- Modal actions -->
                                        <div class="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                                            <button
                                                type="submit"
                                                :disabled="modalLoading || !userForm.name || !userForm.email || (!showEditModal && !userForm.password)"
                                                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                                                :class="{ 'opacity-50 cursor-not-allowed': modalLoading || !userForm.name || !userForm.email || (!showEditModal && !userForm.password) }"
                                            >
                                                <svg
                                                    v-if="modalLoading"
                                                    class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle class="opacity-25" cx="12" cy="12" r="10"
                                                            stroke="currentColor" stroke-width="4"></circle>
                                                    <path class="opacity-75" fill="currentColor"
                                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                {{ showEditModal ? 'Update User' : 'Create User' }}
                                            </button>
                                            <button
                                                type="button"
                                                @click="closeModals"
                                                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteModal" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title"
             role="dialog" aria-modal="true">
            <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <!-- Background overlay -->
                <div
                    class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    aria-hidden="true"
                    @click="showDeleteModal = false"
                ></div>

                <!-- Modal panel -->
                <div
                    class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div class="sm:flex sm:items-start">
                            <div
                                class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                                </svg>
                            </div>
                            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                    Delete User
                                </h3>
                                <div class="mt-2">
                                    <p class="text-sm text-gray-500">
                                        Are you sure you want to delete this user? This action cannot be undone.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            @click="confirmDeleteUser"
                            :disabled="modalLoading"
                            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                            :class="{ 'opacity-50 cursor-not-allowed': modalLoading }"
                        >
                            <svg
                                v-if="modalLoading"
                                class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Delete
                        </button>
                        <button
                            type="button"
                            @click="showDeleteModal = false"
                            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import type {User} from '~/types';
import {useUserStore} from '~/stores/user';

const router = useRouter();
const userStore = useUserStore();

// State
const loading = ref(true);
const error = ref('');
const users = ref<User[]>([]);
const currentUserId = ref('');

// Modal state
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const modalLoading = ref(false);

// User form
const userForm = ref({
    name: '',
    email: '',
    password: '',
    isAdmin: false
});

// Initialize the users page
onMounted(async () => {
    // Check if user is admin
    if (!userStore.isAdmin) {
        router.push('/dashboard');
        return;
    }

    await fetchUsers();
});

// Fetch users
const fetchUsers = async () => {
    loading.value = true;
    error.value = '';

    try {
        users.value = await userStore.fetchAllUsers() as User[];
    } catch (err) {
        console.error('Failed to fetch users:', err);
        error.value = 'Failed to load users. Please try again.';
    } finally {
        loading.value = false;
    }
};

// Handle edit user
const handleEditUser = (user: User) => {
    currentUserId.value = user.id;
    userForm.value = {
        name: user.name,
        email: user.email,
        password: '', // Don't populate password for security
        isAdmin: user.isAdmin || false
    };
    showEditModal.value = true;
};

// Handle delete user
const handleDeleteUser = (user: User) => {
    currentUserId.value = user.id;
    showDeleteModal.value = true;
};

// Confirm delete user
const confirmDeleteUser = async () => {
    if (!currentUserId.value) return;

    modalLoading.value = true;

    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 600));

        // Remove the user from the local state
        users.value = users.value.filter(user => user.id !== currentUserId.value);
        showDeleteModal.value = false;
    } catch (err) {
        console.error('Failed to delete user:', err);
        error.value = 'Failed to delete user. Please try again.';
    } finally {
        modalLoading.value = false;
    }
};

// Handle user form submission
const handleSubmitUser = async () => {
    if (!userForm.value.name || !userForm.value.email || (!showEditModal.value && !userForm.value.password)) return;

    modalLoading.value = true;

    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (showEditModal.value) {
            // Update existing user
            const index = users.value.findIndex(user => user.id === currentUserId.value);
            if (index !== -1) {
                users.value[index] = {
                    ...users.value[index],
                    name: userForm.value.name,
                    email: userForm.value.email,
                    isAdmin: userForm.value.isAdmin,
                    // Update avatar to match name
                    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userForm.value.name)}&background=${userForm.value.isAdmin ? 'FF5722' : '6366F1'}&color=fff`
                };
            }
        } else {
            // Create new user
            const newUser: User = {
                id: Date.now().toString(), // Generate a unique ID
                name: userForm.value.name,
                email: userForm.value.email,
                isAdmin: userForm.value.isAdmin,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userForm.value.name)}&background=${userForm.value.isAdmin ? 'FF5722' : '6366F1'}&color=fff`
            };

            users.value.push(newUser);
        }

        closeModals();
    } catch (err) {
        console.error('Failed to save user:', err);
        error.value = 'Failed to save user. Please try again.';
    } finally {
        modalLoading.value = false;
    }
};

// Get user initials for avatar placeholder
const getUserInitials = (user: User) => {
    if (!user?.firstname) return '?';

    const firstNamePart = user.firstname.charAt(0).toUpperCase();
    const lastNamePart = user.lastname.charAt(0).toUpperCase();
    return firstNamePart + lastNamePart;
};

// Close all modals and reset form
const closeModals = () => {
    showCreateModal.value = false;
    showEditModal.value = false;
    showDeleteModal.value = false;
    currentUserId.value = '';
    userForm.value = {
        name: '',
        email: '',
        password: '',
        isAdmin: false
    };
};
</script>
