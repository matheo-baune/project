<template>
  <div class="bg-white overflow-hidden shadow rounded-lg">
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
          <template v-for="(member, index) in displayMembers" :key="member.id">
            <div 
              class="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-indigo-100 flex items-center justify-center text-indigo-800 font-semibold text-xs"
              :title="member.name"
            >
              {{ getMemberInitials(member) }}
            </div>
          </template>
          <div 
            v-if="group.members.length > maxDisplayMembers" 
            class="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-xs"
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
        >
          View Events
        </NuxtLink>
        <div class="flex space-x-2">
          <button 
            @click="$emit('edit', group)"
            class="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Edit
          </button>
          <button 
            @click="$emit('delete', group.id)"
            class="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
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
}>();

const emit = defineEmits<{
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