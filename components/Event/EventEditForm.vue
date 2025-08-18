<template>
  <div class="bg-white shadow-sm sm:rounded-lg">
    <div class="px-4 py-5 sm:p-6">
      <h3 class="text-lg leading-6 font-medium text-gray-900">
        Edit Event Details
      </h3>
      <div class="mt-5">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Name -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">
              Event Namee *
            </label>
            <div class="mt-1">
              <input 
                type="text" 
                name="name" 
                id="name" 
                v-model="form.name"
                required
                class="shadow-xs focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" 
                placeholder="Birthday Party"
              />
            </div>
          </div>
          
          <!-- Date -->
          <div>
            <label for="date" class="block text-sm font-medium text-gray-700">
              Event Date *
            </label>
            <div class="mt-1">
              <input 
                type="date" 
                name="date" 
                id="date" 
                v-model="form.date"
                required
                class="shadow-xs focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          <!-- Background URL -->
          <div>
            <label for="background" class="block text-sm font-medium text-gray-700">
              Background Image URL
            </label>
            <div class="mt-1">
              <input 
                type="url" 
                name="background" 
                id="background" 
                v-model="form.background"
                class="shadow-xs focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" 
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <p class="mt-1 text-xs text-gray-500">
              Add a URL to a background image for this event
            </p>
          </div>
          
          <!-- Background preview -->
          <div v-if="form.background" class="mt-2">
            <p class="text-sm font-medium text-gray-700 mb-1">Background Preview:</p>
            <img :src="form.background" alt="Background preview" class="h-32 w-full object-cover border border-gray-200 rounded-md" />
          </div>
          
          <!-- Submit buttons -->
          <div class="flex justify-end space-x-3">
            <button 
              type="button" 
              @click="$emit('cancel')"
              class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-xs text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              :disabled="loading"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-xs text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg 
                v-if="loading" 
                class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Update Event
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Event } from '~/types';

const props = defineProps<{
  event: Event;
}>();

const emit = defineEmits<{
  (e: 'update', id: string, name: string, date: string, background?: string): void;
  (e: 'cancel'): void;
}>();

// Form state
const form = ref({
  name: '',
  date: '',
  background: ''
});

// Loading state
const loading = ref(false);

// Initialize form with event data
onMounted(() => {
  if (props.event) {
    form.value = {
      name: props.event.name,
      // Format date to YYYY-MM-DD for input type="date"
      date: formatDateForInput(props.event.date),
      background: props.event.background || ''
    };
  }
});

// Format date string to YYYY-MM-DD for input type="date"
const formatDateForInput = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

// Handle form submission
const handleSubmit = () => {
  loading.value = true;
  
  try {
    emit('update', props.event.id, form.value.name, form.value.date, form.value.background || undefined);
  } finally {
    loading.value = false;
  }
};
</script>