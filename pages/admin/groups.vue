<template>
  <div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Group Management</h1>
          <p class="mt-1 text-sm text-gray-500">
            Manage groups and their members
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
            <Icon name="heroicons-outline:plus" class="h-5 w-5 mr-2" />
            Add Group
          </button>
        </div>
      </div>

      <!-- Admin not authorized -->
      <div v-if="!userStore.isAdmin" class="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
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
        <Icon name="line-md:loading-twotone-loop" class="animate-spin h-8 w-8 text-indigo-600" />
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-700">
              {{ error }}
            </p>
          </div>
        </div>
      </div>

      <!-- Groups Grid -->
      <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="group in groups" :key="group.id" class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  {{ group.name }}
                </h3>
                <p class="mt-1 text-sm text-gray-500">
                  {{ group.members.length }} members
                </p>
              </div>
              <div class="flex -space-x-2 overflow-hidden">
                <template v-for="(member, index) in displayMembers(group)" :key="member.id">
                  <div 
                    class="inline-block h-8 w-8 rounded-full overflow-hidden"
                    :title="member.name"
                  >
                    <img v-if="member.avatar" :src="member.avatar" alt="Member avatar" class="h-full w-full object-cover" />
                    <div v-else class="h-full w-full flex items-center justify-center bg-indigo-100 text-indigo-800 font-semibold text-xs">
                      {{ getMemberInitials(member) }}
                    </div>
                  </div>
                </template>
                <div 
                  v-if="group.members.length > maxDisplayMembers" 
                  class="inline-block h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-xs"
                  :title="remainingMembersNames(group)"
                >
                  +{{ group.members.length - maxDisplayMembers }}
                </div>
              </div>
            </div>
            <div class="mt-4">
              <p class="text-sm text-gray-500">
                Created by: {{ getCreatorName(group.createdBy) }}
              </p>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-4 sm:px-6">
            <div class="flex justify-between">
              <button 
                @click="handleViewMembers(group)"
                class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                View Members
              </button>
              <div class="flex space-x-2">
                <button 
                  @click="handleEditGroup(group)"
                  class="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Edit
                </button>
                <button 
                  @click="handleDeleteGroup(group)"
                  class="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Group Modal -->
    <GroupModal
      :model-value="showCreateModal || showEditModal"
      :mode="showEditModal ? 'edit' : 'create'"
      :loading="modalLoading"
      :initial-group="groupForm"
      :show-background="false"
      @update:modelValue="(val) => { if (!val) closeModals() }"
      @cancel="closeModals"
      @submit="(payload) => handleSubmitGroup(payload)"
    />

    <!-- View Members Modal -->
    <div v-if="showMembersModal" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div 
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          aria-hidden="true"
          @click="showMembersModal = false"
        ></div>

        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  {{ selectedGroup ? selectedGroup.name + ' Members' : 'Group Members' }}
                </h3>
                <div class="mt-4">
                  <div v-if="selectedGroup && selectedGroup.members.length === 0" class="text-center py-4 text-gray-500">
                    This group has no members.
                  </div>
                  <ul v-else class="divide-y divide-gray-200">
                    <li v-for="member in selectedGroup?.members" :key="member.id" class="py-4 flex">
                      <div class="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
                        <img v-if="member.avatar" :src="member.avatar" alt="Member avatar" class="h-full w-full object-cover" />
                        <div v-else class="h-full w-full flex items-center justify-center bg-indigo-100 text-indigo-800 text-sm font-semibold">
                          {{ getMemberInitials(member) }}
                        </div>
                      </div>
                      <div class="ml-3">
                        <p class="text-sm font-medium text-gray-900">{{ member.name }}</p>
                        <p class="text-sm text-gray-500">{{ member.email }}</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              type="button" 
              @click="showMembersModal = false"
              class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div 
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          aria-hidden="true"
          @click="showDeleteModal = false"
        ></div>

        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Delete Group
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Are you sure you want to delete this group? All events and gifts associated with this group will be permanently removed. This action cannot be undone.
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
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { Group, User } from '~/types';
import { useUserStore, useGroupStore } from '~/stores';
import GroupModal from '~/components/group/GroupModal.vue';

const router = useRouter();
const userStore = useUserStore();
const groupStore = useGroupStore();

// State
const loading = ref(true);
const error = ref('');
const groups = ref<Group[]>([]);
const selectedGroup = ref<Group | null>(null);
const currentGroupId = ref('');

// Modal state
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const showMembersModal = ref(false);
const modalLoading = ref(false);

// Maximum number of members to display avatars for
const maxDisplayMembers = 3;

// Group form
const groupForm = ref({
  name: '',
  members: [] as User[]
});

// Initialize the groups page
onMounted(async () => {
  if (!userStore.isLoggedIn) {
      await router.push('/login');
      return;
  }

  if (!userStore.isAdmin) {
    await router.push('/dashboard');
    return;
  }

  await fetchGroups();
});

// Fetch groups
const fetchGroups = async () => {
  loading.value = true;
  error.value = '';

  try {
    // Fetch groups from the store
    const fetchedGroups = await groupStore.fetchGroups();
    groups.value = fetchedGroups;
  } catch (err) {
    console.error('Failed to fetch groups:', err);
    error.value = 'Failed to load groups. Please try again.';
  } finally {
    loading.value = false;
  }
};

// Get the members to display (limited to maxDisplayMembers)
const displayMembers = (group: Group) => {
  return group.members.slice(0, maxDisplayMembers);
};

// Get the names of the remaining members (not displayed)
const remainingMembersNames = (group: Group) => {
  return group.members
    .slice(maxDisplayMembers)
    .map(member => member.name)
    .join(', ');
};

// Get creator name
const getCreatorName = (creatorId: string) => {
  // Find the creator in all group members
  for (const group of groups.value) {
    const creator = group.members.find(member => member.id === creatorId);
    if (creator) {
      return creator.name;
    }
  }
  return 'Unknown';
};

// Handle view members
const handleViewMembers = (group: Group) => {
  selectedGroup.value = group;
  showMembersModal.value = true;
};

// Handle edit group
const handleEditGroup = (group: Group) => {
  currentGroupId.value = group.id;
  groupForm.value = {
    name: group.name,
    members: [...group.members]
  };
  showEditModal.value = true;
};

// Handle delete group
const handleDeleteGroup = (group: Group) => {
  currentGroupId.value = group.id;
  selectedGroup.value = group;
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
  groupForm.value.members.push({
    id: Date.now().toString(), // Temporary ID
    name: '',
    email: ''
  });
};

// Remove a member from the form
const removeMember = (index: number) => {
  groupForm.value.members.splice(index, 1);
};

// Handle group form submission
const handleSubmitGroup = async (payload?: { name: string; members: User[] }) => {
  if (!payload?.name && !groupForm.value.name) return;

  modalLoading.value = true;

  try {
    // Use payload from modal
    const name = payload?.name ?? groupForm.value.name;
    const validMembers = payload?.members ?? [];

    if (showEditModal.value) {
      // Update existing group
      const updatedGroup = await groupStore.updateGroup(
        currentGroupId.value,
        name,
        validMembers
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
  showCreateModal.value = false;
  showEditModal.value = false;
  showDeleteModal.value = false;
  showMembersModal.value = false;
  currentGroupId.value = '';
  selectedGroup.value = null;
  groupForm.value = {
    name: '',
    members: []
  };
};
</script>
