<template>
    <div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Loading state -->
            <div v-if="loading" class="py-12 flex justify-center">
                <UiLoader size="lg" color="text-indigo-600" :label="t('common.loading')"/>
            </div>

            <!-- Error state -->
            <div v-else-if="error" class="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                             fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                  clip-rule="evenodd"/>
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
                            <NuxtLink :to="`/groups/${event?.groupId}`"
                                      class="text-indigo-600 hover:text-indigo-900 mr-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                     stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                                </svg>
                            </NuxtLink>
                            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ event?.name }}</h1>
                        </div>
                        <p class="mt-1 text-sm text-gray-500">
                            {{ formattedDate }}
                        </p>
                    </div>
                    <div class="mt-4 md:mt-0 flex space-x-3">
                        <UiButton @click="copyPublicLink" variant="secondary">
                            <template #icon>
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                                </svg>
                            </template>
                            {{ t('events.shareList') }}
                        </UiButton>
                        <UiButton @click="showEventEditModal = true" variant="secondary">
                            <template #icon>
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                </svg>
                            </template>
                            {{ t('events.editEvent') }}
                        </UiButton>
                        <UiButton :to="`/events/${eventId}/edit`" variant="primary">
                            <template #icon>
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                                </svg>
                            </template>
                            {{ t('events.editGifts') }}
                        </UiButton>
                    </div>
                </div>

                <!-- Gifts section -->
                <div>
                    <h2 class="text-xl font-bold text-gray-900 mb-4 dark:text-white">{{ t('gifts.title') }}</h2>

                    <!-- Empty state -->
                    <EmptyStateCard v-if="gifts.length === 0"
                                    :title="t('gifts.emptyTitle')"
                                    :description="t('gifts.emptyDescriptionForEvent')"
                                    :actionTo="`/events/${eventId}/edit`"
                                    :actionLabel="t('gifts.addGifts')">
                        <template #icon>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none"
                                 viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/>
                            </svg>
                        </template>
                        <template #action-icon>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M12 4v16m8-8H4"/>
                            </svg>
                        </template>
                    </EmptyStateCard>

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

        <!-- Event Edit Modal -->
        <EventEditModal
            v-if="event"
            :is-open="showEventEditModal"
            :event="event"
            @close="showEventEditModal = false"
            @update="handleUpdateEvent"
        />

    </div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted} from 'vue';
import {useI18n} from 'vue-i18n'
import {useRoute, useRouter} from 'vue-router';
import type {Event, Gift} from '~/types';
import {useUserStore, useEventStore, useGiftStore} from '~/stores';
import EventEditModal from '~/components/event/EventEditModal.vue';
import EmptyStateCard from "~/components/ui/EmptyStateCard.vue";
import {useNotificationStore} from '~/stores';

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

// Event edit state
const showEventEditModal = ref(false);

// Notifications store
const notificationStore = useNotificationStore();

// Format the date for display
const {locale, t} = useI18n()
const formattedDate = computed(() => {
    if (!event.value?.date) return '';
    const date = new Date(event.value.date);
    return new Intl.DateTimeFormat(locale.value || 'en', {
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
        notificationStore.success('Public link copied to clipboard!')
    }).catch(() => {
        notificationStore.error('Failed to copy link')
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
            notificationStore.success('Gift reserved successfully!')
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
            notificationStore.success('Reservation cancelled successfully!')
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

// Handle event update
const handleUpdateEvent = async (id: string, name: string, date: string, background?: string) => {
    loading.value = true;
    error.value = '';

    try {
        const updatedEvent = await eventStore.updateEvent(id, name, date, background);

        if (updatedEvent) {
            // Update the event in the local state
            event.value = updatedEvent;

            // Close the modal
            showEventEditModal.value = false;

            // Show success toast
            notificationStore.success('Event updated successfully!')
        } else {
            error.value = eventStore.error || 'Failed to update event';
        }
    } catch (err) {
        console.error('Failed to update event:', err);
        error.value = 'Failed to update event. Please try again.';
    } finally {
        loading.value = false;
    }
};
</script>
