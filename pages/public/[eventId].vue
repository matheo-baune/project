<template>
  <div>
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <div class="flex-shrink-0 flex items-center">
            <span class="text-xl font-bold text-indigo-600">Gift List Manager</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <svg class="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
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
      
      <!-- Event content -->
      <div v-else>
        <!-- Event header -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900">{{ event?.name }}</h1>
          <p class="mt-2 text-lg text-gray-600">
            {{ formattedDate }}
          </p>
          <div class="mt-4 inline-block bg-indigo-100 rounded-full px-4 py-2 text-sm font-medium text-indigo-800">
            Public Gift List
          </div>
        </div>
        
        <!-- Gifts section -->
        <div>
          <h2 class="text-xl font-bold text-gray-900 mb-4 text-center">Gift Ideas</h2>
          <p class="text-center text-gray-600 mb-8">
            Select a gift to reserve it. The gift creator won't see who reserved which gift.
          </p>
          
          <!-- Empty state -->
          <div v-if="gifts.length === 0" class="bg-white shadow rounded-lg p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
            <h3 class="mt-2 text-lg font-medium text-gray-900">No gifts yet</h3>
            <p class="mt-1 text-sm text-gray-500">
              The event creator hasn't added any gifts to this list yet.
            </p>
          </div>
          
          <!-- Gifts grid -->
          <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <GiftCard 
              v-for="gift in gifts" 
              :key="gift.id" 
              :gift="gift"
              :isPublicView="true"
              :isReserved="gift.isReserved"
              @reserve="handleReserveGift"
            />
          </div>
        </div>
      </div>
    </div>
    
    <!-- Reservation Modal -->
    <ReservationModal
      :is-open="showReservationModal"
      :gift="selectedGift"
      @close="showReservationModal = false"
      @reserve="confirmReserveGift"
    />
    
    <!-- Toast Notification -->
    <div 
      v-if="showToast" 
      class="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      {{ toastMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import type { Event, Gift } from '~/types';
import { useEventStore } from '~/stores/event';
import { useGiftStore } from '~/stores/gift';

const route = useRoute();

const eventStore = useEventStore();
const giftStore = useGiftStore();

// Get the event ID from the route
const eventId = route.params.eventId as string;

// State
const loading = ref(true);
const error = ref('');
const event = ref<Event | null>(null);
const gifts = ref<any[]>([]); // Using any to accommodate the isReserved property

// Reservation state
const showReservationModal = ref(false);
const selectedGift = ref<Gift | undefined>(undefined);

// Toast state
const showToast = ref(false);
const toastMessage = ref('');

// Format the date for display
const formattedDate = computed(() => {
  if (!event.value?.date) return '';
  
  const date = new Date(event.value.date);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
});

// Initialize the page
onMounted(async () => {
  await fetchPublicEvent();
  await fetchPublicGifts();
});

// Fetch public event
const fetchPublicEvent = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    const fetchedEvent = await eventStore.getPublicEvent(eventId);
    
    if (fetchedEvent) {
      event.value = fetchedEvent;
    } else {
      error.value = eventStore.error || 'Event not found';
    }
  } catch (err) {
    console.error('Failed to fetch event:', err);
    error.value = 'Failed to load event. Please try again.';
  } finally {
    loading.value = false;
  }
};

// Fetch public gifts
const fetchPublicGifts = async () => {
  if (!eventId) return;
  
  loading.value = true;
  error.value = '';
  
  try {
    const fetchedGifts = await giftStore.getPublicGiftsByEventId(eventId);
    gifts.value = fetchedGifts;
  } catch (err) {
    console.error('Failed to fetch gifts:', err);
    error.value = 'Failed to load gifts. Please try again.';
  } finally {
    loading.value = false;
  }
};

// Handle gift reservation
const handleReserveGift = (giftId: string) => {
  const gift = gifts.value.find(g => g.id === giftId);
  
  if (gift && !gift.isReserved) {
    selectedGift.value = gift;
    showReservationModal.value = true;
  }
};

// Confirm gift reservation
const confirmReserveGift = async (giftId: string, name: string) => {
  loading.value = true;
  error.value = '';
  
  try {
    const success = await giftStore.reserveGift(giftId, name);
    
    if (success) {
      // Update the gift in the local state
      const giftIndex = gifts.value.findIndex(gift => gift.id === giftId);
      
      if (giftIndex !== -1) {
        gifts.value[giftIndex] = {
          ...gifts.value[giftIndex],
          isReserved: true
        };
      }
      
      showReservationModal.value = false;
      
      // Show success toast
      showToast.value = true;
      toastMessage.value = 'Gift reserved successfully! Thank you!';
      
      setTimeout(() => {
        showToast.value = false;
      }, 3000);
    } else {
      error.value = giftStore.error || 'Failed to reserve gift';
    }
  } catch (err) {
    console.error('Failed to reserve gift:', err);
    error.value = 'Failed to reserve gift. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>