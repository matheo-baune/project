<template>
  <div class="bg-white overflow-hidden shadow rounded-lg relative">
    <!-- Reserved badge -->
    <div 
      v-if="gift.reservedBy || isReserved || gift.isReserved" 
      class="absolute top-0 right-0 mt-2 mr-2 z-10"
    >
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Reserved
      </span>
    </div>

    <!-- Gift image -->
    <div class="relative h-48 bg-gray-200">
      <img 
        v-if="gift.image" 
        :src="gift.image" 
        :alt="gift.title" 
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
        </svg>
      </div>
    </div>

    <!-- Gift details -->
    <div class="px-4 py-4">
      <div class="flex justify-between items-start">
        <h3 class="text-lg font-medium text-gray-900 truncate" :title="gift.title">
          {{ gift.title }}
        </h3>
        <span v-if="gift.price" class="text-sm font-medium text-gray-900">
          {{ formatPrice(gift.price) }}
        </span>
      </div>

      <!-- External link -->
      <div v-if="gift.link" class="mt-2">
        <a 
          :href="gift.link" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="text-sm text-indigo-600 hover:text-indigo-500 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          View product
        </a>
      </div>
    </div>

    <!-- Actions -->
    <div class="bg-gray-50 px-4 py-3">
      <div class="flex justify-between">
        <!-- Creator actions -->
        <div v-if="isCreator && !isPublicView" class="flex space-x-2">
          <button 
            @click="$emit('edit', gift)"
            class="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Edit
          </button>
          <button 
            @click="$emit('delete', gift.id)"
            class="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>

        <!-- Creator view of reservations -->
        <div v-if="isCreator && !isPublicView" class="w-full">
          <div v-if="gift.isReserved || gift.reservedBy" class="text-xs text-gray-500 text-center">
            Reserved by someone
          </div>
          <div v-else class="text-xs text-gray-500 text-center">
            Not yet reserved
          </div>
        </div>

        <!-- Reservation actions for non-creators -->
        <div v-else class="w-full">
          <button 
            v-if="!gift.reservedBy && !isReserved && !gift.isReserved"
            @click="$emit('reserve', gift.id)"
            class="w-full inline-flex justify-center items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Reserve this gift
          </button>
          <button 
            v-else-if="isReservedByCurrentUser && !isPublicView"
            @click="$emit('cancel-reservation', gift.id)"
            class="w-full inline-flex justify-center items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel reservation
          </button>
          <div 
            v-else-if="!isPublicView" 
            class="text-xs text-gray-500 text-center"
          >
            Reserved by {{ gift.reservedBy }}
          </div>
          <div 
            v-else-if="gift.reservedBy || isReserved || gift.isReserved" 
            class="text-xs text-gray-500 text-center"
          >
            Already reserved
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Gift } from '~/types';
import { useUserStore } from '~/stores/index';

const props = defineProps<{
  gift: Gift;
  isPublicView?: boolean;
  isReserved?: boolean; // For public view where we don't show who reserved
}>();

const emit = defineEmits<{
  (e: 'edit', gift: Gift): void;
  (e: 'delete', id: string): void;
  (e: 'reserve', id: string): void;
  (e: 'cancel-reservation', id: string): void;
}>();

const userStore = useUserStore();

// Check if the current user is the creator of the gift
const isCreator = computed(() => {
  return userStore.user?.id === props.gift.createdBy;
});

// Check if the gift is reserved by the current user
const isReservedByCurrentUser = computed(() => {
  return props.gift.reservedBy === userStore.user?.name;
});

// Format price with currency symbol
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};
</script>
