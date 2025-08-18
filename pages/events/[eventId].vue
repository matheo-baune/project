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
                    <div class="shrink-0">
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
                    </div>
                </div>

                <!-- Gifts section -->
                <div>
                    <div class="flex items-center justify-between mb-4">
                      <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ t('gifts.title') }}</h2>
                      <UiButton v-if="canAddGift" variant="primary" @click="openCreateGift">
                        <template #icon>
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                          </svg>
                        </template>
                        {{ t('gifts.createGift') }}
                      </UiButton>
                    </div>

                    <!-- Empty state -->
                    <EmptyStateCard v-if="displayedGifts.length === 0"
                                    :title="t('gifts.emptyTitle')"
                                    :description="t('gifts.emptyDescriptionForEvent')"
                                    :actionLabel="t('gifts.addGifts')">
                        <template #icon>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none"
                                 viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/>
                            </svg>
                        </template>
                        <template #action>
                          <UiButton v-if="canAddGift" variant="primary" @click="openCreateGift">
                            <template #icon>
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                              </svg>
                            </template>
                            {{ t('gifts.addGifts') }}
                          </UiButton>
                        </template>
                    </EmptyStateCard>

                    <!-- Gifts content -->
                    <div v-else>
                      <!-- Single-person event -->
                      <div v-if="event?.scope === 'single'">
                        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                          <GiftCard
                            v-for="gift in displayedGifts"
                            :key="gift.id"
                            :gift="gift"
                            @reserve="handleReserveGift"
                            @cancel-reservation="handleCancelReservation"
                            @edit="openEditGift"
                            @delete="handleDeleteGift"
                            @comments="openComments"
                          />
                        </div>
                      </div>

                      <!-- Multiple-person event -->
                      <div v-else>
                        <!-- Your gifts -->
                        <div v-if="yourGifts.length">
                          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ t('gifts.yourGifts') }}</h3>
                          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-6">
                            <GiftCard
                              v-for="gift in yourGifts"
                              :key="gift.id"
                              :gift="gift"
                              @reserve="handleReserveGift"
                              @cancel-reservation="handleCancelReservation"
                              @edit="openEditGift"
                              @delete="handleDeleteGift"
                              @comments="openComments"
                            />
                          </div>
                        </div>

                        <!-- Others' gifts -->
                        <div>
                          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ t('gifts.othersGifts') }}</h3>
                          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            <GiftCard
                              v-for="gift in othersGifts"
                              :key="gift.id"
                              :gift="gift"
                              @reserve="handleReserveGift"
                              @cancel-reservation="handleCancelReservation"
                              @edit="openEditGift"
                              @delete="handleDeleteGift"
                              @comments="openComments"
                            />
                          </div>
                        </div>
                      </div>
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

        <!-- Comments Modal -->
        <CommentsModal
            :is-open="showCommentsModal"
            :gift-id="commentsGift?.id"
            :gift-title="commentsGift?.title"
            @close="showCommentsModal = false"
        />
 
         <!-- Gift Create/Edit Modal -->
        <GiftFormModal
            :is-open="showGiftModal"
            :event-id="eventId"
            :gift="editingGift || undefined"
            @close="closeGiftModal"
            @submit="handleCreateGift"
            @update="handleUpdateGift"
        />

        <!-- Event Edit Modal (unified) -->
        <EventModal
            v-if="event"
            :model-value="showEventEditModal"
            mode="edit"
            :initial-event="event"
            :loading="loading"
            @update:modelValue="(val) => { if (!val) showEventEditModal = false }"
            @cancel="showEventEditModal = false"
            @submit="handleUpdateEventFromModal"
        />

    </div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted} from 'vue';
import {useI18n} from 'vue-i18n'
import {useRoute, useRouter} from 'vue-router';
import type {Event, Gift} from '~/types';
import {useUserStore, useEventStore, useGiftStore} from '~/stores';
import EventModal from '~/components/event/EventModal.vue';
import EmptyStateCard from "~/components/ui/EmptyStateCard.vue";
import UiButton from "~/components/ui/UiButton.vue";
import GiftFormModal from "~/components/gift/GiftFormModal.vue";
import GiftCard from "~/components/gift/GiftCard.vue";
import CommentsModal from "~/components/gift/CommentsModal.vue";
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

// Comments state
const showCommentsModal = ref(false);
const commentsGift = ref<Gift | null>(null);

// Gift modal state
const showGiftModal = ref(false);
const editingGift = ref<Gift | null>(null);

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

// Computed lists for UI logic
const currentUserId = computed(() => userStore.currentUser?.id || userStore.user?.id)
const isTargetPerson = computed(() => event.value?.scope === 'single' && currentUserId.value && event.value?.targetPersonId === currentUserId.value)

const yourGifts = computed(() => gifts.value.filter(g => g.createdBy === (currentUserId.value || '')))
const targetGifts = computed(() => event.value?.targetPersonId ? gifts.value.filter(g => g.createdBy === event.value!.targetPersonId) : gifts.value)
const othersGifts = computed(() => gifts.value.filter(g => g.createdBy !== (currentUserId.value || '')))
const displayedGifts = computed(() => {
    if (event.value?.scope === 'single') {
        return isTargetPerson.value ? yourGifts.value : targetGifts.value
    }
    return gifts.value
})

const canAddGift = computed(() => {
    if (event.value?.scope === 'single') {
        return isTargetPerson.value
    }
    return true
})

// Initialize the page
onMounted(async () => {
    // Check if user is logged in
    if (!userStore.isLoggedIn) {
        await router.push('/login');
        return;
    }

    await fetchEvent();
    await fetchGifts();

    useHead({
        title: `Wishlist - ${event.value?.name || ''}`
    })
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

// Open create gift modal
const openCreateGift = () => {
    editingGift.value = null;
    showGiftModal.value = true;
};

// Open edit gift modal
const openEditGift = (gift: Gift) => {
    editingGift.value = gift;
    showGiftModal.value = true;
};

// Close gift modal
const closeGiftModal = () => {
    showGiftModal.value = false;
    editingGift.value = null;
};

// Create gift handler
const handleCreateGift = async (giftData: Omit<Gift, 'id' | 'createdBy'>) => {
    loading.value = true;
    error.value = '';
    try {
        const newGift = await giftStore.createGift(giftData);
        if (newGift) {
            gifts.value.push(newGift);
            notificationStore.success(t('gifts.createSuccess'));
            closeGiftModal();
        } else {
            error.value = giftStore.error || t('gifts.errors.createFailed');
        }
    } catch (e) {
        console.error('Failed to create gift:', e);
        error.value = t('gifts.errors.createFailed');
    } finally {
        loading.value = false;
    }
};

// Update gift handler
const handleUpdateGift = async (id: string, updates: Partial<Omit<Gift, 'id' | 'createdBy' | 'eventId'>>) => {
    loading.value = true;
    error.value = '';
    try {
        const updated = await giftStore.updateGift(id, updates);
        if (updated) {
            const idx = gifts.value.findIndex(g => g.id === id);
            if (idx !== -1) gifts.value[idx] = updated;
            notificationStore.success(t('gifts.updateSuccess'));
            closeGiftModal();
        } else {
            error.value = giftStore.error || t('gifts.errors.updateFailed');
        }
    } catch (e) {
        console.error('Failed to update gift:', e);
        error.value = t('gifts.errors.updateFailed');
    } finally {
        loading.value = false;
    }
};

// Delete gift handler
const handleDeleteGift = async (id: string) => {
    // Simple confirm; could be replaced with a nicer modal later
    if (!confirm(t('gifts.confirmDelete'))) return;
    loading.value = true;
    error.value = '';
    try {
        const success = await giftStore.deleteGift(id);
        if (success) {
            gifts.value = gifts.value.filter(g => g.id !== id);
            notificationStore.success(t('gifts.deleteSuccess'));
        } else {
            error.value = giftStore.error || t('gifts.errors.deleteFailed');
        }
    } catch (e) {
        console.error('Failed to delete gift:', e);
        error.value = t('gifts.errors.deleteFailed');
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

const openComments = (gift: Gift) => {
    commentsGift.value = gift
    showCommentsModal.value = true
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

// Handle event update (legacy handler retained for potential route usage)
const handleUpdateEvent = async (id: string, name: string, date: string, background?: string, scope?: 'single' | 'multiple', targetPersonId?: string) => {
    loading.value = true;
    error.value = '';

    try {
        const updatedEvent = await eventStore.updateEvent(id, name, date, background, scope, targetPersonId);

        if (updatedEvent) {
            event.value = updatedEvent;
            showEventEditModal.value = false;
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

// Unified modal submit handler
const handleUpdateEventFromModal = async (payload: { id?: string; name: string; date: string; background?: string; scope?: 'single' | 'multiple'; targetPersonId?: string }) => {
    const targetId = payload.id || eventId
    await handleUpdateEvent(targetId, payload.name, payload.date, payload.background, payload.scope, payload.targetPersonId)
};
</script>
