<template>
  <div>
    <Navbar />

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
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <div class="flex items-center">
              <NuxtLink :to="`/groups/${event?.groupId}`" class="text-indigo-600 hover:text-indigo-900 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </NuxtLink>
              <h1 class="text-2xl font-bold text-gray-900">{{ event?.name }}</h1>
            </div>
            <p class="mt-1 text-sm text-gray-500">
              {{ formattedDate }}
            </p>
          </div>
          <div class="mt-4 md:mt-0 flex space-x-3">
            <button 
              @click="copyPublicLink"
              class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Share List
            </button>
            <NuxtLink 
              :to="`/events/${eventId}/edit`" 
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit Gifts
            </NuxtLink>
          </div>
        </div>

        <!-- Gifts section -->
        <div>
          <h2 class="text-xl font-bold text-gray-900 mb-4">Gifts</h2>

          <!-- Empty state -->
          <div v-if="gifts.length === 0" class="bg-white shadow rounded-lg p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
            <h3 class="mt-2 text-lg font-medium text-gray-900">No gifts yet</h3>
            <p class="mt-1 text-sm text-gray-500">
              Go to the edit page to add gifts to this event.
            </p>
            <div class="mt-6">
              <NuxtLink 
                :to="`/events/${eventId}/edit`" 
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Gifts
              </NuxtLink>
            </div>
          </div>

          <!-- Gifts grid -->
          <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <GiftCard 
              v-for="gift in gifts" 
              :key="gift.id" 
              :gift="gift"
              :isCreator="isCreator"
              @reserve="handleReserveGift"
              @cancel-reservation="handleCancelReservation"
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
import { useRoute, useRouter } from 'vue-router';
import type { Event, Gift } from '~/types';
import { useUserStore } from '~/stores/user';
import { useEventStore } from '~/stores/event';
import { useGiftStore } from '~/stores/gift';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const eventStore = useEventStore();
const giftStore = useGiftStore();

// Get the event ID from the route
const eventId = route.params.eventId as string;

// State
const loading = ref(true);
const error = ref('');
const event = ref<Event | null>(null);
const gifts = ref<Gift[]>([]);

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

// Check if the current user is the creator of the event
const isCreator = computed(() => {
  return userStore.user?.id === event.value?.createdBy;
});

// Initialize the page
onMounted(async () => {
  // Check if user is logged in
  if (!userStore.isLoggedIn) {
    await router.push('/login');
    return;
  }

  await fetchEvent();
  await fetchGifts();
});

// Fetch event
const fetchEvent = async () => {
  loading.value = true;
  error.value = '';

  try {
    const fetchedEvent = await eventStore.fetchEvent(eventId);

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

// Fetch gifts
const fetchGifts = async () => {
  if (!eventId) return;

  loading.value = true;
  error.value = '';

  try {
    const fetchedGifts = await giftStore.fetchGiftsByEventId(eventId);
    gifts.value = fetchedGifts;
  } catch (err) {
    console.error('Failed to fetch gifts:', err);
    error.value = 'Failed to load gifts. Please try again.';
  } finally {
    loading.value = false;
  }
};

// Copy the public link to the clipboard
const copyPublicLink = () => {
  const url = `${window.location.origin}/public/${eventId}`;
  navigator.clipboard.writeText(url).then(() => {
    showToast.value = true;
    toastMessage.value = 'Public link copied to clipboard!';

    setTimeout(() => {
      showToast.value = false;
    }, 3000);
  });
};

// Handle gift reservation
const handleReserveGift = (giftId: string) => {
  const gift = gifts.value.find(g => g.id === giftId);

  if (gift) {
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
          reservedBy: name
        };
      }

      showReservationModal.value = false;

      // Show success toast
      showToast.value = true;
      toastMessage.value = 'Gift reserved successfully!';

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

// Handle cancellation of reservation
const handleCancelReservation = async (giftId: string) => {
  loading.value = true;
  error.value = '';

  try {
    const success = await giftStore.cancelReservation(giftId);

    if (success) {
      // Update the gift in the local state
      const giftIndex = gifts.value.findIndex(gift => gift.id === giftId);

      if (giftIndex !== -1) {
        gifts.value[giftIndex] = {
          ...gifts.value[giftIndex],
          reservedBy: undefined
        };
      }

      // Show success toast
      showToast.value = true;
      toastMessage.value = 'Reservation cancelled successfully!';

      setTimeout(() => {
        showToast.value = false;
      }, 3000);
    } else {
      error.value = giftStore.error || 'Failed to cancel reservation';
    }
  } catch (err) {
    console.error('Failed to cancel reservation:', err);
    error.value = 'Failed to cancel reservation. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>
