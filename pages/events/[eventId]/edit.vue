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

      <!-- Not authorized state -->
      <div v-else-if="!isCreator" class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-yellow-700">
              You are not authorized to edit this event. Only the creator can edit gifts.
            </p>
            <div class="mt-4">
              <div class="flex">
                <NuxtLink 
                  :to="`/events/${eventId}`" 
                  class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Back to Event
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Event content -->
      <div v-else>
        <!-- Event header -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <div class="flex items-center">
              <NuxtLink :to="`/events/${eventId}`" class="text-indigo-600 hover:text-indigo-900 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </NuxtLink>
              <h1 class="text-2xl font-bold text-gray-900">Edit: {{ event?.name }}</h1>
            </div>
            <p class="mt-1 text-sm text-gray-500">
              {{ formattedDate }}
            </p>
          </div>
          <button 
            @click="showAddGiftForm = true"
            class="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Gift
          </button>
        </div>

        <!-- Add Gift Form -->
        <div v-if="showAddGiftForm" class="mb-8">
          <GiftForm 
            :event-id="eventId"
            @submit="handleCreateGift"
            @cancel="showAddGiftForm = false"
          />
        </div>

        <!-- Edit Gift Form -->
        <div v-if="showEditGiftForm && selectedGift" class="mb-8">
          <GiftForm 
            :event-id="eventId"
            :gift="selectedGift"
            @update="handleUpdateGift"
            @cancel="showEditGiftForm = false"
          />
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
              Get started by adding gifts to this event.
            </p>
            <div class="mt-6">
              <button 
                @click="showAddGiftForm = true"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Gift
              </button>
            </div>
          </div>

          <!-- Gifts grid -->
          <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <GiftCard 
              v-for="gift in gifts" 
              :key="gift.id" 
              :gift="gift"
              :isCreator="true"
              @edit="handleEditGift"
              @delete="handleDeleteGift"
            />
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
                  Delete Gift
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Are you sure you want to delete this gift? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              type="button" 
              @click="confirmDeleteGift"
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

// Form state
const showAddGiftForm = ref(false);
const showEditGiftForm = ref(false);
const selectedGift = ref<Gift | null>(null);

// Modal state
const showDeleteModal = ref(false);
const modalLoading = ref(false);
const currentGiftId = ref('');

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
    userStore.initUser(); // For demo purposes
    // In a real app, we would redirect to login
    // router.push('/login');
    // return;
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

// Handle create gift
const handleCreateGift = async (giftData: Omit<Gift, 'id' | 'createdBy'>) => {
  loading.value = true;
  error.value = '';

  try {
    const newGift = await giftStore.createGift(giftData);

    if (newGift) {
      gifts.value.push(newGift);
      showAddGiftForm.value = false;

      // Show success toast
      showToast.value = true;
      toastMessage.value = 'Gift added successfully!';

      setTimeout(() => {
        showToast.value = false;
      }, 3000);
    } else {
      error.value = giftStore.error || 'Failed to create gift';
    }
  } catch (err) {
    console.error('Failed to create gift:', err);
    error.value = 'Failed to create gift. Please try again.';
  } finally {
    loading.value = false;
  }
};

// Handle edit gift
const handleEditGift = (gift: Gift) => {
  selectedGift.value = gift;
  showEditGiftForm.value = true;
  showAddGiftForm.value = false; // Close add form if open
};

// Handle update gift
const handleUpdateGift = async (id: string, giftData: Partial<Omit<Gift, 'id' | 'createdBy' | 'eventId'>>) => {
  loading.value = true;
  error.value = '';

  try {
    const updatedGift = await giftStore.updateGift(id, giftData);

    if (updatedGift) {
      // Update the gift in the local state
      const giftIndex = gifts.value.findIndex(gift => gift.id === id);

      if (giftIndex !== -1) {
        gifts.value[giftIndex] = updatedGift;
      }

      showEditGiftForm.value = false;

      // Show success toast
      showToast.value = true;
      toastMessage.value = 'Gift updated successfully!';

      setTimeout(() => {
        showToast.value = false;
      }, 3000);
    } else {
      error.value = giftStore.error || 'Failed to update gift';
    }
  } catch (err) {
    console.error('Failed to update gift:', err);
    error.value = 'Failed to update gift. Please try again.';
  } finally {
    loading.value = false;
  }
};

// Handle delete gift
const handleDeleteGift = (giftId: string) => {
  currentGiftId.value = giftId;
  showDeleteModal.value = true;
};

// Confirm delete gift
const confirmDeleteGift = async () => {
  if (!currentGiftId.value) return;

  modalLoading.value = true;

  try {
    const success = await giftStore.deleteGift(currentGiftId.value);

    if (success) {
      // Remove the gift from the local state
      gifts.value = gifts.value.filter(gift => gift.id !== currentGiftId.value);
      showDeleteModal.value = false;

      // Show success toast
      showToast.value = true;
      toastMessage.value = 'Gift deleted successfully!';

      setTimeout(() => {
        showToast.value = false;
      }, 3000);
    } else {
      error.value = giftStore.error || 'Failed to delete gift';
    }
  } catch (err) {
    console.error('Failed to delete gift:', err);
    error.value = 'Failed to delete gift. Please try again.';
  } finally {
    modalLoading.value = false;
  }
};
</script>
