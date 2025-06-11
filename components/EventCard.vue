<template>
  <!-- Card View (Default) -->
  <div v-if="displayMode === 'card'" class="event-card overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
    <!-- Background image or gradient based on event type -->
    <div 
      class="relative p-4 bg-cover bg-center" 
      :style="backgroundStyle"
    >
      <!-- Event icon -->
      <div class="absolute top-3 right-3 bg-white bg-opacity-20 p-2 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      <!-- Event details -->
      <div class="text-white" style="text-shadow: 0 1px 3px rgba(0,0,0,0.6);">
        <h3 class="text-lg font-bold mb-1">
          {{ event.name }}
        </h3>
        <div class="flex items-center mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p class="text-sm text-white text-opacity-90">
            {{ formattedDate }}
          </p>
        </div>

        <!-- Status badge -->
        <div 
          v-if="isUpcoming" 
          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white bg-opacity-30"
          style="text-shadow: 0 1px 2px rgba(0,0,0,0.5);"
        >
          <span class="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
          Upcoming
        </div>
        <div 
          v-else-if="isPast" 
          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white bg-opacity-30"
          style="text-shadow: 0 1px 2px rgba(0,0,0,0.5);"
        >
          <span class="w-2 h-2 bg-gray-400 rounded-full mr-1"></span>
          Past
        </div>
      </div>
    </div>

    <!-- Event actions table -->
    <div class="bg-white p-3">
      <table class="w-full text-sm">
        <caption class="sr-only">Event Actions</caption>
        <thead>
          <tr>
            <th scope="col" class="sr-only">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="py-2 border-b border-gray-100">
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13h-2m2 0h2m-6 0H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-6z" />
                </svg>
                <NuxtLink 
                  :to="`/events/${event.id}`" 
                  class="text-indigo-600 hover:text-indigo-900 font-medium"
                >
                  View Gifts
                </NuxtLink>
              </div>
            </td>
          </tr>
          <tr>
            <td class="py-2">
              <div class="flex justify-between">
                <button 
                  @click="copyPublicLink"
                  class="flex items-center text-gray-500 hover:text-gray-700"
                  title="Copy public link"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share
                </button>
                <NuxtLink 
                  :to="`/events/${event.id}/edit`" 
                  class="flex items-center text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </NuxtLink>
                <button 
                  @click="$emit('delete', event.id)"
                  class="flex items-center text-red-500 hover:text-red-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- List View -->
  <div v-else-if="displayMode === 'list'" class="event-list-item flex items-center bg-white rounded-lg shadow-sm hover:shadow transition-all duration-200 overflow-hidden border border-gray-100">
    <!-- Event status indicator -->
    <div class="w-2 h-full" :class="isUpcoming ? 'bg-green-400' : 'bg-gray-300'"></div>

    <!-- Event details -->
    <div class="flex-1 p-3">
      <div class="flex justify-between items-center">
        <h3 class="text-sm font-medium text-gray-900">{{ event.name }}</h3>
        <span class="text-xs text-gray-500">{{ formattedDate }}</span>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex space-x-3 p-3 border-l border-gray-100">
      <NuxtLink 
        :to="`/events/${event.id}`" 
        class="text-xs text-indigo-600 hover:text-indigo-900"
      >
        View
      </NuxtLink>
      <button 
        @click="copyPublicLink"
        class="text-xs text-gray-500 hover:text-gray-700"
      >
        Share
      </button>
      <button 
        @click="$emit('delete', event.id)"
        class="text-xs text-red-500 hover:text-red-700"
      >
        Delete
      </button>
    </div>
  </div>

  <!-- Small View -->
  <div v-else-if="displayMode === 'small'" class="event-card-small overflow-hidden rounded-lg shadow-sm hover:shadow transition-all duration-200 border border-gray-100">
    <div class="p-2 bg-white">
      <h3 class="text-xs font-medium text-gray-900 truncate">{{ event.name }}</h3>
      <p class="text-xs text-gray-500">{{ formattedDate }}</p>
      <div class="mt-2 flex justify-between text-xs">
        <NuxtLink 
          :to="`/events/${event.id}`" 
          class="text-indigo-600 hover:text-indigo-900"
        >
          View
        </NuxtLink>
        <span 
          v-if="isUpcoming" 
          class="text-green-600"
        >
          Upcoming
        </span>
        <span 
          v-else-if="isPast" 
          class="text-gray-500"
        >
          Past
        </span>
      </div>
    </div>
  </div>

  <!-- Large View -->
  <div v-else-if="displayMode === 'large'" class="event-card-large overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
    <!-- Background image or gradient based on event type -->
    <div 
      class="relative p-6 bg-cover bg-center" 
      :style="backgroundStyle"
    >
      <!-- Event icon -->
      <div class="absolute top-4 right-4 bg-white bg-opacity-20 p-2 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      <!-- Event details -->
      <div class="text-white" style="text-shadow: 0 1px 3px rgba(0,0,0,0.6);">
        <h3 class="text-xl font-bold mb-2">
          {{ event.name }}
        </h3>
        <div class="flex items-center mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p class="text-base text-white text-opacity-90">
            {{ formattedDate }}
          </p>
        </div>

        <!-- Status badge -->
        <div 
          v-if="isUpcoming" 
          class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-30"
          style="text-shadow: 0 1px 2px rgba(0,0,0,0.5);"
        >
          <span class="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
          Upcoming
        </div>
        <div 
          v-else-if="isPast" 
          class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-30"
          style="text-shadow: 0 1px 2px rgba(0,0,0,0.5);"
        >
          <span class="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
          Past
        </div>
      </div>
    </div>

    <!-- Event actions -->
    <div class="bg-white p-4">
      <div class="flex justify-between items-center mb-3">
        <NuxtLink 
          :to="`/events/${event.id}`" 
          class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13h-2m2 0h2m-6 0H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-6z" />
          </svg>
          View Gifts
        </NuxtLink>
        <div class="flex space-x-2">
          <button 
            @click="copyPublicLink"
            class="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </button>
          <NuxtLink 
            :to="`/events/${event.id}/edit`" 
            class="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </NuxtLink>
          <button 
            @click="$emit('delete', event.id)"
            class="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50"
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
import { computed, ref } from 'vue';
import type { Event } from '~/types';

const props = defineProps<{
  event: Event;
  displayMode?: 'card' | 'list' | 'small' | 'large';
}>();

// Default to card view if no display mode is provided
const displayMode = computed(() => props.displayMode || 'card');

const emit = defineEmits<(e: 'delete', id: string) => void>();

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

// Background images for different event types
const backgroundImages = {
  birthday: 'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  christmas: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  wedding: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  default: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
};

// Determine background style based on event type
const backgroundStyle = computed(() => {
  // Check if event name contains any of the event types
  const eventNameLower = props.event.name.toLowerCase();
  let backgroundImage = backgroundImages.default;

  if (eventNameLower.includes('birthday')) {
    backgroundImage = backgroundImages.birthday;
  } else if (eventNameLower.includes('christmas')) {
    backgroundImage = backgroundImages.christmas;
  } else if (eventNameLower.includes('wedding')) {
    backgroundImage = backgroundImages.wedding;
  }

  // Add a dark overlay to ensure text is readable
  return {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${backgroundImage})`,
  };
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
