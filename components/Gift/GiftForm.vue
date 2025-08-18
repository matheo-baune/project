<template>
  <div class="bg-white shadow-sm sm:rounded-lg">
    <div class="px-4 py-5 sm:p-6">
      <h3 class="text-lg leading-6 font-medium text-gray-900">
        {{ isEditing ? 'Edit Gift' : 'Add New Gift' }}
      </h3>
      <div class="mt-5">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Title -->
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700">
              Gift Title *
            </label>
            <div class="mt-1">
              <input 
                type="text" 
                name="title" 
                id="title" 
                v-model="form.title"
                required
                class="shadow-xs focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" 
                placeholder="PlayStation 5"
              />
            </div>
          </div>
          
          <!-- Price -->
          <div>
            <label for="price" class="block text-sm font-medium text-gray-700">
              Price
            </label>
            <div class="mt-1 relative rounded-md shadow-xs">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="text-gray-500 sm:text-sm">$</span>
              </div>
              <input 
                type="number" 
                name="price" 
                id="price" 
                v-model="form.price"
                min="0"
                step="0.01"
                class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md" 
                placeholder="0.00"
              />
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span class="text-gray-500 sm:text-sm">USD</span>
              </div>
            </div>
          </div>
          
          <!-- Link -->
          <div>
            <label for="link" class="block text-sm font-medium text-gray-700">
              Product Link
            </label>
            <div class="mt-1">
              <input 
                type="url" 
                name="link" 
                id="link" 
                v-model="form.link"
                class="shadow-xs focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" 
                placeholder="https://www.amazon.com/product"
              />
            </div>
            <p class="mt-1 text-xs text-gray-500">
              Add a link to where this gift can be purchased
            </p>
          </div>
          
          <!-- Image URL -->
          <div>
            <label for="image" class="block text-sm font-medium text-gray-700">
              Image URL
            </label>
            <div class="mt-1">
              <input 
                type="url" 
                name="image" 
                id="image" 
                v-model="form.image"
                class="shadow-xs focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" 
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <p class="mt-1 text-xs text-gray-500">
              Add a URL to an image of the gift
            </p>
          </div>
          
          <!-- Image preview -->
          <div v-if="form.image" class="mt-2">
            <p class="text-sm font-medium text-gray-700 mb-1">Image Preview:</p>
            <img :src="form.image" alt="Gift preview" class="h-32 w-auto object-contain border border-gray-200 rounded-md" />
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
              {{ isEditing ? 'Update Gift' : 'Add Gift' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { Gift } from '~/types';

const props = defineProps<{
  eventId: string;
  gift?: Gift;
}>();

const emit = defineEmits<{
  (e: 'submit', gift: Omit<Gift, 'id' | 'createdBy'>): void;
  (e: 'update', id: string, gift: Partial<Omit<Gift, 'id' | 'createdBy' | 'eventId'>>): void;
  (e: 'cancel'): void;
}>();

// Determine if we're editing an existing gift or creating a new one
const isEditing = computed(() => !!props.gift);

// Form state
const form = ref({
  title: '',
  price: undefined as number | undefined,
  link: '',
  image: '',
  eventId: props.eventId
});

// Loading state
const loading = ref(false);

// Initialize form with gift data if editing
onMounted(() => {
  if (props.gift) {
    form.value = {
      title: props.gift.title,
      price: props.gift.price,
      link: props.gift.link || '',
      image: props.gift.image || '',
      eventId: props.gift.eventId
    };
  }
});

// Handle form submission
const handleSubmit = () => {
  loading.value = true;
  
  try {
    // Prepare gift data
    const giftData = {
      title: form.value.title,
      price: form.value.price,
      link: form.value.link || undefined,
      image: form.value.image || undefined,
      eventId: form.value.eventId
    };
    
    // Emit the appropriate event based on whether we're editing or creating
    if (isEditing.value && props.gift) {
      emit('update', props.gift.id, giftData);
    } else {
      emit('submit', giftData);
    }
  } finally {
    loading.value = false;
  }
};
</script>