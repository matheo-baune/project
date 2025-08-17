<template>
  <div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading state -->
      <div v-if="loading" class="py-12 flex justify-center">
        <UiLoader size="lg" color="text-indigo-600" :label="t('common.loading')" />
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
            {{ t('public.publicGiftList') }}
          </div>
        </div>
        
        <!-- Gifts section -->
        <div>
          <h2 class="text-xl font-bold text-gray-900 mb-4 text-center">{{ t('public.giftIdeas') }}</h2>
          <p class="text-center text-gray-600 mb-8">
            {{ t('public.hint') }}
          </p>
          
          <!-- Empty state -->
          <EmptyStateCard v-if="gifts.length === 0"
                          :title="t('public.noGifts')"
                          :description="t('public.noGiftsDescription')">
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </template>
          </EmptyStateCard>
          
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
    
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router';
import type { Event, Gift } from '~/types';
import { useEventStore, useGiftStore, useNotificationStore } from '~/stores';
import EmptyStateCard from "~/components/ui/EmptyStateCard.vue";

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

// Notifications store
const notificationStore = useNotificationStore();

// Format the date for display
const { locale, t } = useI18n()
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
      notificationStore.success('Gift reserved successfully! Thank you!')
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