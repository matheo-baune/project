<template>
    <div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Loading state -->
            <div v-if="loading" class="py-12 flex justify-center">
                <UiLoader size="lg" color="text-indigo-600" :label="t('common.loading')"/>
            </div>

            <!-- Event content -->
            <div v-else>
                <!-- Event background banner -->
                <div v-if="event?.background"
                     class="mb-4 relative rounded-lg overflow-hidden border border-gray-200">
                    <img :src="event?.background" alt="Event background" class="w-full h-40 object-cover" />
                    <div class="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60"></div>
                    <div class="absolute inset-0 flex items-center justify-center text-center px-4">
                        <h1 class="text-white text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-xl">
                            {{ event?.name }}
                        </h1>
                    </div>
                </div>
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
                      <UiButton v-if="activeTab === 'mine'" variant="primary" @click="openCreateGift">
                        <template #icon>
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                          </svg>
                        </template>
                        {{ t('gifts.createGift') }}
                      </UiButton>
                    </div>

                    <!-- Tabs: show Others only if there are other members -->
                    <div class="mb-4">
                      <UTabs v-model="activeTab" :items="tabItems" :ui="{ list: { base: 'w-full' } }" />
                    </div>

                    <!-- Mine tab content -->
                    <div v-if="activeTab === 'mine'">
                      <EmptyStateCard v-if="yourGifts.length === 0"
                                      :title="t('gifts.emptyTitle')"
                                      :description="t('gifts.emptyDescriptionForEvent')"
                                      :actionLabel="t('gifts.addGifts')">
                        <template #icon>
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/>
                          </svg>
                        </template>
                        <template #action>
                          <UiButton variant="primary" @click="openCreateGift">
                            <template #icon>
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                              </svg>
                            </template>
                            {{ t('gifts.addGifts') }}
                          </UiButton>
                        </template>
                      </EmptyStateCard>

                      <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

                    <!-- Others tab content -->
                    <div v-else>
                      <div class="flex flex-col lg:flex-row gap-4">
                        <!-- Members list -->
                        <div class="lg:w-1/4 w-full bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                          <div class="px-3 py-2 border-b border-gray-100 dark:border-gray-700 text-sm font-medium">{{ t('gifts.members') || 'Members' }}</div>
                          <ul class="max-h-80 overflow-auto">
                            <li v-for="m in otherMembers" :key="m.id">
                              <button
                                class="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                                :class="selectedMemberId === m.id ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700' : ''"
                                @click="selectedMemberId = m.id"
                              >
                                <img v-if="m.avatar" :src="m.avatar" :alt="m.firstname + ' ' + m.lastname" class="h-6 w-6 rounded-full object-cover" />
                                <div v-else class="h-6 w-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-semibold">
                                  {{ (m.firstname || m.username)?.[0] }}
                                </div>
                                <span class="text-sm">{{ m.firstname }} {{ m.lastname }}</span>
                              </button>
                            </li>
                          </ul>
                        </div>
                        <!-- Gifts grid for selected member -->
                        <div class="flex-1">
                          <EmptyStateCard v-if="selectedMemberGifts.length === 0"
                                          :title="t('gifts.emptyTitle')"
                                          :description="t('gifts.emptyDescriptionForEvent')">
                            <template #icon>
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/>
                              </svg>
                            </template>
                          </EmptyStateCard>
                          <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            <GiftCard
                              v-for="gift in selectedMemberGifts"
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
    {{event}}
</template>

<script setup lang="ts">
import {ref, computed, onMounted, watch} from 'vue';
import {useI18n} from 'vue-i18n'
import {useRoute, useRouter} from 'vue-router';
import type {Event, Gift, User} from '~/types';
import EventModal from '~/components/Event/EventModal.vue';
import EmptyStateCard from "~/components/ui/EmptyStateCard.vue";
import UiButton from "~/components/ui/UiButton.vue";
import GiftFormModal from "~/components/Gift/GiftFormModal.vue";
import GiftCard from "~/components/Gift/GiftCard.vue";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const eventStore = useEventStore();
const giftStore = useGiftStore();

// Get the event ID from the route
const eventId = route.params.eventId as string;

// State
const loading = ref(true);
const event = ref<Event | null>(null);
const gifts = ref<Gift[]>([]);

// Group members for the "Others" tab
const groupMembers = ref<User[]>([]);
const otherMembers = computed(() => (groupMembers.value || []).filter(m => m.id !== (currentUserId.value || '')));

// Tabs state
const activeTab = ref<'mine' | 'others'>('mine');
const tabItems = computed(() => {
    const items = [{ label: t('gifts.yourGifts') || 'My gifts', slot: 'mine', content: 'mine', value: 'mine' }];
    if (otherMembers.value.length > 0) {
        items.push({ label: t('gifts.othersGifts') || 'Others', slot: 'others', content: 'others', value: 'others' });
    }
    return items;
});

// Selected member in Others tab
const selectedMemberId = ref<string | null>(null);
const selectedMemberGifts = computed(() => selectedMemberId.value ? gifts.value.filter(g => g.createdBy === selectedMemberId.value) : []);

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

// Computed lists for UI logic
const currentUserId = computed(() => userStore.currentUser?.id || userStore.user?.id)

const yourGifts = computed(() => gifts.value.filter(g => g.createdBy === (currentUserId.value || '')))


// Initialize the page
onMounted(async () => {
    // Check if user is logged in
    if (!userStore.isLoggedIn) {
        await router.push('/login');
        return;
    }

    await fetchEvent();
    await fetchGifts();
    await fetchGroupMembers();

    useHead({
        title: `Wishlist - ${event.value?.name || ''}`
    })
});

// Fetch event
const fetchEvent = async () => {
    loading.value = true;

    try {
        const fetchedEvent = await eventStore.fetchEvent(eventId);

        if (fetchedEvent) {
            event.value = fetchedEvent;
        } else {
            notificationStore.error(eventStore.error || 'Event not found');
        }
    } catch (err) {
        console.error('Failed to fetch event:', err);
        notificationStore.error('Failed to load event. Please try again.');
    } finally {
        loading.value = false;
    }
};

// Fetch group members for the event's group
const fetchGroupMembers = async () => {
    const gid = event.value?.groupId
    if (!gid) return
    try {
        const res = await fetch(`/api/groups/${gid}`)
        if (!res.ok) return
        const group = await res.json()
        groupMembers.value = Array.isArray(group.members) ? group.members : []
        // Default selected member: first other member who has gifts, else first other member
        const giftCreators = new Set(gifts.value.filter(g => g.createdBy !== (currentUserId.value || '')).map(g => g.createdBy))
        const preferred = (groupMembers.value || []).find(m => m.id !== (currentUserId.value || '') && giftCreators.has(m.id))
        const fallback = (groupMembers.value || []).find(m => m.id !== (currentUserId.value || ''))
        selectedMemberId.value = preferred?.id || fallback?.id || null
    } catch (e) {
        // Silent fail; members list is optional for this UI
        console.warn('Failed to fetch group members', e)
    }
}

// Fetch gifts
const fetchGifts = async () => {
    if (!eventId) return;

    loading.value = true;

    try {
        const fetchedGifts = await giftStore.fetchGiftsByEventId(eventId);
        gifts.value = fetchedGifts;
    } catch (err) {
        console.error('Failed to fetch gifts:', err);
        notificationStore.error('Failed to load gifts. Please try again.');
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

// Keep selectedMemberId coherent when data changes
watch(otherMembers, (list) => {
    if (!list.find(m => m.id === selectedMemberId.value)) {
        selectedMemberId.value = list[0]?.id || null
    }
})
watch(activeTab, (tab) => {
    if (tab === 'others' && !selectedMemberId.value && otherMembers.value.length) {
        selectedMemberId.value = otherMembers.value[0].id
    }
})

// Create gift handler
const handleCreateGift = async (giftData: Omit<Gift, 'id' | 'createdBy'>) => {
    loading.value = true;
    try {
        const newGift = await giftStore.createGift(giftData);
        if (newGift) {
            gifts.value.push(newGift);
            notificationStore.success(t('gifts.createSuccess'));
            closeGiftModal();
        } else {
            notificationStore.error(giftStore.error || t('gifts.errors.createFailed'));
        }
    } catch (e) {
        console.error('Failed to create gift:', e);
        notificationStore.error(t('gifts.errors.createFailed'));
    } finally {
        loading.value = false;
    }
};

// Update gift handler
const handleUpdateGift = async (id: string, updates: Partial<Omit<Gift, 'id' | 'createdBy' | 'eventId'>>) => {
    loading.value = true;
    try {
        const updated = await giftStore.updateGift(id, updates);
        if (updated) {
            const idx = gifts.value.findIndex(g => g.id === id);
            if (idx !== -1) gifts.value[idx] = updated;
            notificationStore.success(t('gifts.updateSuccess'));
            closeGiftModal();
        } else {
            notificationStore.error(giftStore.error || t('gifts.errors.updateFailed'));
        }
    } catch (e) {
        console.error('Failed to update gift:', e);
        notificationStore.error(t('gifts.errors.updateFailed'));
    } finally {
        loading.value = false;
    }
};

// Delete gift handler
const handleDeleteGift = async (id: string) => {
    // Simple confirm; could be replaced with a nicer modal later
    if (!confirm(t('gifts.confirmDelete'))) return;
    loading.value = true;
    try {
        const success = await giftStore.deleteGift(id);
        if (success) {
            gifts.value = gifts.value.filter(g => g.id !== id);
            notificationStore.success(t('gifts.deleteSuccess'));
        } else {
            notificationStore.error(giftStore.error || t('gifts.errors.deleteFailed'));
        }
    } catch (e) {
        console.error('Failed to delete gift:', e);
        notificationStore.error(t('gifts.errors.deleteFailed'));
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
            notificationStore.error(giftStore.error || 'Failed to reserve gift');
        }
    } catch (err) {
        console.error('Failed to reserve gift:', err);
        notificationStore.error('Failed to reserve gift. Please try again.');
    } finally {
        loading.value = false;
    }
};

// Handle cancellation of reservation
const handleCancelReservation = async (giftId: string) => {
    loading.value = true;

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
            notificationStore.error(giftStore.error || 'Failed to cancel reservation');
        }
    } catch (err) {
        console.error('Failed to cancel reservation:', err);
        notificationStore.error('Failed to cancel reservation. Please try again.');
    } finally {
        loading.value = false;
    }
};

// Handle event update (legacy handler retained for potential route usage)
const handleUpdateEvent = async (id: string, name: string, date: string, background?: string, scope?: 'single' | 'multiple', targetPersonId?: string) => {
    loading.value = true;

    try {
        const updatedEvent = await eventStore.updateEvent(id, name, date, background, scope, targetPersonId);

        if (updatedEvent) {
            event.value = updatedEvent;
            showEventEditModal.value = false;
            notificationStore.success('Event updated successfully!')
        } else {
            notificationStore.error(eventStore.error || 'Failed to update event');
        }
    } catch (err) {
        console.error('Failed to update event:', err);
        notificationStore.error('Failed to update event. Please try again.');
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
