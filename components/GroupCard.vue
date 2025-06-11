<template>
  <!-- Card View (Default) -->
  <div 
    v-if="displayMode === 'card'"
    class="overflow-hidden shadow rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md dark:bg-gray-800 dark:border-gray-700"
    @click="$emit('click', group)"
  >
    <!-- Background image or gradient -->
    <div 
      class="relative px-4 py-5 sm:p-6 bg-cover bg-center" 
      :style="backgroundStyle"
    >
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg leading-6 font-medium text-white" style="text-shadow: 0 1px 3px rgba(0,0,0,0.6);">
            {{ group.name }}
          </h3>
          <p class="mt-1 text-sm text-white text-opacity-90" style="text-shadow: 0 1px 2px rgba(0,0,0,0.5);">
            {{ group.members.length }} members
          </p>
        </div>
        <div class="flex -space-x-2 overflow-hidden">
          <template v-for="(member, index) in displayMembers" :key="member.id">
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
            :title="remainingMembersNames"
          >
            +{{ group.members.length - maxDisplayMembers }}
          </div>
        </div>
      </div>
    </div>
    <div class="bg-gray-50 px-4 py-4 sm:px-6">
      <div class="flex justify-between">
        <NuxtLink 
          :to="`/groups/${group.id}`" 
          class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          @click.stop
        >
          View Events
        </NuxtLink>
        <div class="flex space-x-2">
          <button 
            @click.stop="$emit('edit', group)"
            class="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Edit
          </button>
          <button 
            @click.stop="$emit('delete', group.id)"
            class="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- List View -->
  <div 
    v-else-if="displayMode === 'list'" 
    class="group-list-item flex items-center bg-white rounded-lg shadow-sm hover:shadow transition-all duration-200 overflow-hidden border border-gray-100 cursor-pointer dark:bg-gray-800 dark:border-gray-700 dark:text-white"
    @click="$emit('click', group)"
  >
    <!-- Group status indicator -->
    <div class="w-2 h-full bg-indigo-400"></div>

    <!-- Group details -->
    <div class="flex-1 p-3">
      <div class="flex justify-between items-center">
        <h3 class="text-sm font-medium text-gray-900">{{ group.name }}</h3>
        <span class="text-xs text-gray-500">{{ group.members.length }} members</span>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex space-x-3 p-3 border-l border-gray-100">
      <NuxtLink 
        :to="`/groups/${group.id}`" 
        class="text-xs text-indigo-600 hover:text-indigo-900"
        @click.stop
      >
        View
      </NuxtLink>
      <button 
        @click.stop="$emit('edit', group)"
        class="text-xs text-gray-500 hover:text-gray-700"
      >
        Edit
      </button>
      <button 
        @click.stop="$emit('delete', group.id)"
        class="text-xs text-red-500 hover:text-red-700"
      >
        Delete
      </button>
    </div>
  </div>

  <!-- Large View -->
  <div 
    v-else-if="displayMode === 'large'" 
    class="group-card-large overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer dark:bg-gray-800 dark:border-gray-700"
    @click="$emit('click', group)"
  >
    <!-- Background image or gradient -->
    <div 
      class="relative p-6 bg-cover bg-center" 
      :style="backgroundStyle"
    >
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-xl font-bold mb-2 text-white" style="text-shadow: 0 1px 3px rgba(0,0,0,0.6);">
            {{ group.name }}
          </h3>
          <p class="text-base text-white text-opacity-90" style="text-shadow: 0 1px 2px rgba(0,0,0,0.5);">
            {{ group.members.length }} members
          </p>
        </div>
        <div class="flex -space-x-2 overflow-hidden">
          <template v-for="(member, index) in displayMembers" :key="member.id">
            <div 
              class="inline-block h-10 w-10 rounded-full overflow-hidden"
              :title="member.name"
            >
              <img v-if="member.avatar" :src="member.avatar" alt="Member avatar" class="h-full w-full object-cover" />
              <div v-else class="h-full w-full flex items-center justify-center bg-indigo-100 text-indigo-800 font-semibold text-sm">
                {{ getMemberInitials(member) }}
              </div>
            </div>
          </template>
          <div 
            v-if="group.members.length > maxDisplayMembers" 
            class="inline-block h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-sm"
            :title="remainingMembersNames"
          >
            +{{ group.members.length - maxDisplayMembers }}
          </div>
        </div>
      </div>
    </div>
    <div class="bg-white p-4 dark:bg-gray-800 dark:text-white">
      <div class="flex justify-between items-center mb-3">
        <NuxtLink 
          :to="`/groups/${group.id}`" 
          class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600"
          @click.stop
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          View Events
        </NuxtLink>
        <div class="flex space-x-2">
          <button 
            @click.stop="$emit('edit', group)"
            class="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <button 
            @click.stop="$emit('delete', group.id)"
            class="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 dark:bg-gray-700 dark:text-red-400 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Group, User } from '~/types';

const props = defineProps<{
  group: Group;
  displayMode?: 'card' | 'list' | 'large';
}>();

// Default to card view if no display mode is provided
const displayMode = computed(() => props.displayMode || 'card');

const emit = defineEmits<{
  (e: 'click', group: Group): void;
  (e: 'edit', group: Group): void;
  (e: 'delete', id: string): void;
}>();

// Maximum number of members to display avatars for
const maxDisplayMembers = 3;

// Get the members to display (limited to maxDisplayMembers)
const displayMembers = computed(() => {
  return props.group.members.slice(0, maxDisplayMembers);
});

// Get the names of the remaining members (not displayed)
const remainingMembersNames = computed(() => {
  return props.group.members
    .slice(maxDisplayMembers)
    .map(member => member.name)
    .join(', ');
});

// Background images for different group types
const backgroundImages = {
  family: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  friends: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  work: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  default: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
};

// Determine background style based on group type or custom background
const backgroundStyle = computed(() => {
  // If the group has a custom background, use it
  if (props.group.background) {
    return {
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${props.group.background})`,
    };
  }

  // Otherwise, determine background based on group name
  const groupNameLower = props.group.name.toLowerCase();
  let backgroundImage = backgroundImages.default;

  if (groupNameLower.includes('family')) {
    backgroundImage = backgroundImages.family;
  } else if (groupNameLower.includes('friend')) {
    backgroundImage = backgroundImages.friends;
  } else if (groupNameLower.includes('work') || groupNameLower.includes('colleague')) {
    backgroundImage = backgroundImages.work;
  }

  // Add a dark overlay to ensure text is readable
  return {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${backgroundImage})`,
  };
});

// Get member initials for avatar
const getMemberInitials = (member: User) => {
  if (!member.name) return '?';

  const nameParts = member.name.split(' ');
  if (nameParts.length === 1) {
    return nameParts[0].charAt(0).toUpperCase();
  }

  return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
};
</script>
