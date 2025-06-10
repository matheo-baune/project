<template>
  <div class="bg-white overflow-hidden shadow rounded-lg">
    <div class="px-4 py-5 sm:p-6">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            {{ event.name }}
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            {{ formattedDate }}
          </p>
        </div>
        <div class="flex items-center space-x-2">
          <span 
            v-if="isUpcoming" 
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
          >
            Upcoming
          </span>
          <span 
            v-else-if="isPast" 
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
          >
            Past
          </span>
        </div>
      </div>
    </div>
    <div class="bg-gray-50 px-4 py-4 sm:px-6">
      <div class="flex justify-between">
        <div class="flex space-x-2">
          <NuxtLink 
            :to="`/events/${event.id}`" 
            class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            View Gifts
          </NuxtLink>
          <button 
            @click="copyPublicLink"
            class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            title="Copy public link"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Share
          </button>
        </div>
        <div class="flex space-x-2">
          <NuxtLink 
            :to="`/events/${event.id}/edit`" 
            class="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Edit
          </NuxtLink>
          <button 
            @click="$emit('delete', event.id)"
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
import { computed, ref } from 'vue';
import type { Event } from '~/types';

const props = defineProps<{
  event: Event;
}>();

const emit = defineEmits<{
  (e: 'delete', id: string): void;
}>();

// Format the date for display
const formattedDate = computed(() => {
  const date = new Date(props.event.date);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
});

// Check if the event is in the future
const isUpcoming = computed(() => {
  const eventDate = new Date(props.event.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return eventDate >= today;
});

// Check if the event is in the past
const isPast = computed(() => {
  const eventDate = new Date(props.event.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return eventDate < today;
});

// Copy the public link to the clipboard
const linkCopied = ref(false);
const copyPublicLink = () => {
  const url = `${window.location.origin}/public/${props.event.id}`;
  navigator.clipboard.writeText(url).then(() => {
    linkCopied.value = true;
    setTimeout(() => {
      linkCopied.value = false;
    }, 2000);
    
    // Show a toast notification (in a real app)
    alert('Public link copied to clipboard!');
  });
};
</script>