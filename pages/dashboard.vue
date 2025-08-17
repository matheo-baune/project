<template>
    <div class="min-h-screen dark:bg-gray-900 transition-colors duration-200">
        <Navbar/>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:text-white">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">My Groups</h1>
                <div class="flex items-center space-x-3">
                    <!-- Display mode selector -->
                    <div
                        class="flex items-center space-x-2 bg-white rounded-lg shadow-sm p-1 border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                        <button
                            @click="displayMode = 'card'"
                            class="p-1 rounded"
                            :class="displayMode === 'card' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:bg-opacity-50 dark:text-indigo-300' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'"
                            title="Card view"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z"/>
                            </svg>
                        </button>
                        <button
                            @click="displayMode = 'large'"
                            class="p-1 rounded"
                            :class="displayMode === 'large' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:bg-opacity-50 dark:text-indigo-300' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'"
                            title="Large card view"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z"/>
                            </svg>
                        </button>
                    </div>

                    <button
                        @click="showCreateGroupModal = true"
                        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-600 dark:focus:ring-indigo-400 dark:focus:ring-offset-gray-900"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                        </svg>
                        Create Group
                    </button>
                </div>
            </div>

            <!-- Loading state -->
            <div v-if="loading" class="flex justify-center items-center py-12">
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

            <!-- Empty state -->
            <EmptyStateCard v-else-if="groups.length === 0"
                            title="No groups yet"
                            description="Get started by creating a new group for your family, friends, or colleagues.">
              <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 dark:text-gray-300"
                     fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </template>
            </EmptyStateCard>

            <!-- Groups grid or list based on display mode -->
            <div v-else
                 :class="{
          'grid gap-6': true,
          'grid-cols-1': true,
          'sm:grid-cols-2 md:grid-cols-3': displayMode === 'card',
          'sm:grid-cols-1 lg:grid-cols-2': displayMode === 'large',
        }"
            >
                <GroupCard
                    v-for="group in groups"
                    :key="group.id"
                    :group="group"
                    :displayMode="displayMode"
                    @click="router.push(`/groups/${group.id}`)"
                    @edit="handleEditGroup"
                    @delete="handleDeleteGroup"
                />
            </div>
        </div>

        <!-- Create/Edit Group Modal -->
        <GroupModal
          :model-value="showCreateGroupModal || showEditGroupModal"
          :mode="showEditGroupModal ? 'edit' : 'create'"
          :loading="modalLoading"
          :initial-group="groupForm"
          :show-background="true"
          :creator-id="userStore.currentUser?.id"
          @update:modelValue="(val) => { if (!val) closeModals() }"
          @cancel="closeModals"
          @submit="(payload) => handleSubmitGroup(payload)"
        />

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
                                    Delete Group
                                </h3>
                                <div class="mt-2">
                                    <p class="text-sm text-gray-500">
                                        Are you sure you want to delete this group? All events and gifts associated with
                                        this group will be permanently removed. This action cannot be undone.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            @click="confirmDeleteGroup"
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
import {onMounted, ref, watch} from 'vue';
import {useRouter} from 'vue-router';
import type {Group, User} from '~/types';
import {useUserStore, useGroupStore} from '~/stores';
import GroupModal from '~/components/GroupModal.vue';
import EmptyStateCard from "~/components/ui/EmptyStateCard.vue";

const router = useRouter();
const userStore = useUserStore();
const groupStore = useGroupStore();

// State
const loading = ref(true);
const error = ref('');
const groups = ref<Group[]>([]);
const displayMode = ref<'card' | 'large'>('card');

// Modal state
const showCreateGroupModal = ref(false);
const showEditGroupModal = ref(false);
const showDeleteModal = ref(false);
const modalLoading = ref(false);
const currentGroupId = ref('');

// Group form
const groupForm = ref({
    name: '',
    background: '',
    members: [] as User[]
});

// Form validation
const formErrors = ref<string[]>([]);

// Watch for changes in form fields to clear specific errors
watch(() => groupForm.value.name, (newValue) => {
    if (newValue && formErrors.value.includes('Le nom du groupe est requis')) {
        formErrors.value = formErrors.value.filter(error => error !== 'Le nom du groupe est requis');
    }
});

// Initialize the dashboard
onMounted(async () => {
    // Check if user is logged in
    if (!userStore.isLoggedIn) {
        router.push('/login');
        return;
    }


    await fetchGroups();
});

// Fetch groups
const fetchGroups = async () => {
    loading.value = true;
    error.value = '';

    try {
        groups.value = await groupStore.fetchGroups();
    } catch (err) {
        console.error('Failed to fetch groups:', err);
        error.value = 'Failed to load groups. Please try again.';
    } finally {
        loading.value = false;
    }
};

// Handle edit group
const handleEditGroup = (group: Group) => {
    currentGroupId.value = group.id;
    groupForm.value = {
        name: group.name,
        background: group.background || '',
        members: [...group.members]
    };
    showEditGroupModal.value = true;
};

// Handle delete group
const handleDeleteGroup = (groupId: string) => {
    currentGroupId.value = groupId;
    showDeleteModal.value = true;
};

// Confirm delete group
const confirmDeleteGroup = async () => {
    if (!currentGroupId.value) return;

    modalLoading.value = true;

    try {
        const success = await groupStore.deleteGroup(currentGroupId.value);

        if (success) {
            // Remove the group from the local state
            groups.value = groups.value.filter(group => group.id !== currentGroupId.value);
            showDeleteModal.value = false;
        } else {
            error.value = groupStore.error || 'Failed to delete group';
        }
    } catch (err) {
        console.error('Failed to delete group:', err);
        error.value = 'Failed to delete group. Please try again.';
    } finally {
        modalLoading.value = false;
    }
};

// Add a new member to the form
const addMember = () => {
    // TODO - Implement logic to add a new member
    console.log('Adding new member');
};

// Remove a member from the form
const removeMember = (id: string) => {
    console.log('Removing member with index:', id);

};

// Handle group form submission
const handleSubmitGroup = async (payload?: { name: string; background?: string; members: User[] }) => {
    // Clear previous errors
    formErrors.value = [];

    // Validate required fields
    const name = payload?.name ?? groupForm.value.name;
    if (!name) {
        formErrors.value.push("Le nom du groupe est requis");
    }

    // If there are validation errors, don't proceed
    if (formErrors.value.length > 0) {
        return;
    }

    modalLoading.value = true;

    try {
        // Use payload
        const validMembers = payload?.members ?? [];
        const bg = payload?.background ?? groupForm.value.background;

        if (showEditGroupModal.value) {
            // Update existing group
            const updatedGroup = await groupStore.updateGroup(
                currentGroupId.value,
                name,
                validMembers,
                bg
            );

            if (updatedGroup) {
                // Update the group in the local state
                const index = groups.value.findIndex(group => group.id === currentGroupId.value);
                if (index !== -1) {
                    groups.value[index] = updatedGroup;
                }
                closeModals();
            } else {
                error.value = groupStore.error || 'Failed to update group';
            }
        } else {
            // Create new group
            const newGroup = await groupStore.createGroup(
                name,
                validMembers,
                bg
            );

            if (newGroup) {
                // Refresh groups from the store instead of pushing to avoid duplication
                groups.value = [...groupStore.groups];
                closeModals();
            } else {
                error.value = groupStore.error || 'Failed to create group';
            }
        }
    } catch (err) {
        console.error('Failed to save group:', err);
        error.value = 'Failed to save group. Please try again.';
    } finally {
        modalLoading.value = false;
    }
};


// Get member initials for avatar placeholder
const getMemberInitials = (user: User) => {
    if (!user?.firstname) return '?';

    const firstNamePart = user.firstname.charAt(0).toUpperCase();
    const lastNamePart = user.lastname.charAt(0).toUpperCase();
    return firstNamePart + lastNamePart;
};

// Close all modals and reset form
const closeModals = () => {
    showCreateGroupModal.value = false;
    showEditGroupModal.value = false;
    showDeleteModal.value = false;
    currentGroupId.value = '';
    groupForm.value = {
        name: '',
        background: '',
        members: []
    };
    // Clear any validation errors
    formErrors.value = [];
};
</script>
