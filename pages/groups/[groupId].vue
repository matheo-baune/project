<template>
  <div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Loading state -->
            <div v-if="loading" class="flex justify-center items-center py-12">
                <Icon name="line-md:loading-twotone-loop" class="animate-spin h-8 w-8 text-indigo-600" />
            </div>

            <!-- Error state -->
            <div v-else-if="error" class="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                <div class="flex">
                    <div class="shrink-0">
                        <Icon name="heroicons-solid:x-circle" class="h-5 w-5 text-red-400" aria-hidden="true" />
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-red-700">
                            {{ error }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Group content -->
            <div v-else>
                <!-- Group background banner -->
                <div v-if="group?.background" class="mb-4">
                    <img :src="group?.background" alt="Group background"
                         class="w-full h-40 object-cover rounded-lg border border-gray-200"/>
                </div>
                <!-- Group header -->
                <div class="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
                    <div class="flex items-center">
                        <NuxtLink to="/dashboard" class="text-gray-400 hover:text-gray-600 mr-2">
                            <Icon name="heroicons-outline:arrow-left" class="h-4 w-4" />
                        </NuxtLink>
                        <h1 class="text-xl font-medium text-gray-900 dark:text-white">{{ group?.name }}</h1>
                        <span class="ml-2 text-xs text-gray-500">{{ group?.members.length }} members</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <button
                            @click="showEditGroupModal = true"
                            class="inline-flex items-center px-2 py-1 border border-gray-300 shadow-xs text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                        >
                            <Icon name="fa-regular:edit" size="1.2em" class="me-1"/>
                        </button>
                        <button
                            @click="showCreateEventModal = true"
                            class="text-xs text-indigo-600 hover:text-indigo-900"
                        >
                            + New Event
                        </button>
                    </div>
                </div>

                <!-- Two-column layout -->
                <div class="flex flex-col md:flex-row gap-4">
                    <!-- Members list (left column) -->
                    <div class="w-full md:w-1/4 lg:w-1/5">
                        <div class="bg-white shadow-sm sm:rounded-lg sticky top-4">
                            <div class="px-3 py-3 border-b border-gray-200">
                                <h3 class="text-sm font-medium text-gray-900">({{group?.members.length}}) Members</h3>
                            </div>
                            <ul class="divide-y divide-gray-100">
                                <li v-for="member in group?.members" :key="member.id" class="px-3 py-2">
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center">
                                            <div
                                                class="h-7 w-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-semibold text-xs select-none">
                                                <img v-if="member?.avatar" :src="member.avatar" alt="User avatar"
                                                     class="h-full w-full object-cover rounded-full" />
                                                <span v-else>{{ getMemberInitials(member) }}</span>
                                            </div>
                                            <div class="ml-2 truncate">
                                                <div class="text-xs font-medium text-gray-900">
                                                    {{ member.firstname + ' ' + member.lastname }}
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <span v-if="member.id === group?.createdBy" class="text-xs text-indigo-600"
                                                  title="Creator"><Icon name="fa6-solid:crown" class="text-warning"
                                                                        color="yellow"/></span>
                                            <button
                                                v-if="currentUser?.id === group?.createdBy && member.id !==
                                                currentUser?.id"
                                                class="text-red-500 hover:text-red-700 cursor-pointer"
                                                title="Remove member"
                                                @click="removeMemberInline(member.id)"
                                            >
                                                <Icon name="heroicons-outline:x-mark" class="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <!-- Events section (right column) -->
                    <div class="w-full md:w-3/4 lg:w-4/5">
                        <div class="flex justify-between items-center mb-3">
                            <h2 class="text-lg font-medium text-gray-900 dark:text-white">Events</h2>

                            <!-- Display mode selector -->
                            <div v-if="events.length > 0"
                                class="flex items-center space-x-2 bg-white rounded-lg shadow-xs p-1 border border-gray-100">
                                <button
                                    @click="displayMode = 'small'"
                                    class="p-1 rounded-sm"
                                    :class="displayMode === 'small' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'"
                                    title="Small grid view"
                                >
                                    <Icon name="heroicons-outline:view-grid" class="h-4 w-4" />
                                </button>
                                <button
                                    @click="displayMode = 'card'"
                                    class="p-1 rounded-sm"
                                    :class="displayMode === 'card' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'"
                                    title="Card view"
                                >
                                    <Icon name="heroicons-outline:rectangle-stack" class="h-4 w-4" />
                                </button>
                                <button
                                    @click="displayMode = 'large'"
                                    class="p-1 rounded-sm"
                                    :class="displayMode === 'large' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'"
                                    title="Large card view"
                                >
                                    <Icon name="heroicons-outline:view-columns" class="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <!-- Empty state -->
                        <div v-if="events.length === 0"
                             class="bg-white border border-gray-100 rounded-lg p-4 text-center">
                            <Icon name="heroicons-outline:calendar" class="h-8 w-8 mx-auto text-gray-400" />
                            <h3 class="mt-2 text-sm font-medium text-gray-900">No events yet</h3>
                            <button
                                @click="showCreateEventModal = true"
                                class="mt-3 text-xs text-indigo-600 hover:text-indigo-900"
                            >
                                + Create Event
                            </button>
                        </div>

                        <!-- Events grid or list based on display mode -->
                        <div v-else
                             :class="{
              'grid gap-3': true,
              'grid-cols-1': true,
              'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4': displayMode === 'small',
              'sm:grid-cols-2 lg:grid-cols-3': displayMode === 'card',
              'sm:grid-cols-1 lg:grid-cols-2': displayMode === 'large',
            }"
                        >
                            <EventCard
                                v-for="event in events"
                                :key="event.id"
                                :event="event"
                                :displayMode="displayMode"
                                @delete="handleDeleteEvent"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Create/Edit Event Modal -->
        <EventModal
          :model-value="showCreateEventModal"
          mode="create"
          :loading="modalLoading"
          :members="group?.members"
          @update:modelValue="(val) => { if (!val) closeModals() }"
          @cancel="closeModals"
          @submit="handleSubmitEvent"
        />

        <!-- Edit Group Modal -->
        <GroupModal
            :model-value="showEditGroupModal"
            mode="edit"
            :loading="modalLoading"
            :initial-group="groupForm"
            :show-background="true"
            :creator-id="group?.createdBy"
            @update:modelValue="(val) => { if (!val) closeModals() }"
            @cancel="closeModals"
            @submit="(payload) => handleSubmitGroup(payload)"
        />

        <!-- Delete Confirmation Modal -->
        <BaseModal :is-open="showDeleteModal" :title="'Delete Event'" @close="showDeleteModal = false">
          <template #header>
            <div class="flex items-center gap-3">
              <div class="mx-auto sm:mx-0 shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-red-100">
                <Icon name="heroicons-outline:exclamation-triangle" class="h-6 w-6 text-red-600" aria-hidden="true" />
              </div>
              <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">Delete Event</h3>
            </div>
          </template>

          <p class="text-sm text-gray-600 dark:text-gray-300">
            Are you sure you want to delete this event? All gifts associated with this event will be permanently removed. This action cannot be undone.
          </p>

          <template #footer>
            <UiButton variant="primary" class="bg-red-600 hover:bg-red-700 focus:ring-red-500 mx-2"
                      :disabled="modalLoading" @click="confirmDeleteEvent">
              <template #icon>
                <Icon v-if="modalLoading" name="line-md:loading-twotone-loop" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
              </template>
              Delete
            </UiButton>
            <UiButton class="sm:ml-3 sm:mt-0 mt-3" variant="secondary" @click="showDeleteModal = false">
              Cancel
            </UiButton>
          </template>
        </BaseModal>
    </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import type {Group, Event, User} from '~/types';
import {useUserStore, useGroupStore, useEventStore} from '~/stores';
import GroupModal from '~/components/group/GroupModal.vue';
import BaseModal from "~/components/ui/BaseModal.vue";
import UiButton from "~/components/ui/UiButton.vue";
import EventModal from "~/components/event/EventModal.vue";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const groupStore = useGroupStore();
const eventStore = useEventStore();

// Get the group ID from the route
const groupId = route.params.groupId as string;


// State
const loading = ref(true);
const error = ref('');
const group = ref<Group>(null);
const events = ref<Event[]>([]);
const currentUser = ref(userStore.currentUser);
const displayMode = ref<'card' | 'list' | 'small' | 'large'>('card');

// Modal state
const showCreateEventModal = ref(false);
const showEditGroupModal = ref(false);
const showDeleteModal = ref(false);
const modalLoading = ref(false);
const currentEventId = ref('');

// Forms
const groupForm = ref({
    name: '',
    background: '',
    members: [] as User[]
});

const eventForm = ref({
    name: '',
    date: new Date().toISOString().split('T')[0], // Today's date as default
});

// Initialize the page
onMounted(async () => {
    // Check if user is logged in
    if (!userStore.isLoggedIn) {
        await router.push('/login');
        return;
    }

    await fetchGroup();
    await fetchEvents();

    useHead({
        title: `Wishlist - ${groupForm.value.name}`,
        meta: [
            {name: 'description', content: 'Page du tableau de bord de mon application.'}
        ]
    })
});

// Fetch group
const fetchGroup = async () => {
    loading.value = true;
    error.value = '';

    try {
        const fetchedGroup = await groupStore.fetchGroup(groupId);
        if (fetchedGroup) {
            group.value = fetchedGroup;

            // Initialize group form with current group data
            groupForm.value = {
                name: fetchedGroup.name,
                background: fetchedGroup.background || '',
                members: [...fetchedGroup.members]
            };
        } else {
            error.value = groupStore.error || 'Group not found';
        }
    } catch (err) {
        console.error('Failed to fetch group:', err);
        error.value = 'Failed to load group. Please try again.';
    } finally {
        loading.value = false;
    }
};

// Fetch events
const fetchEvents = async () => {
    if (!groupId) return;

    loading.value = true;
    error.value = '';

    try {
        const fetchedEvents = await eventStore.fetchEventsByGroupId(groupId);
        events.value = fetchedEvents as Event[];
    } catch (err) {
        console.error('Failed to fetch events:', err);
        error.value = 'Failed to load events. Please try again.';
    } finally {
        loading.value = false;
    }
};

// Get member initials for avatar
const getMemberInitials = (user: User) => {
    if (!user?.firstname) return '?';

    const firstNamePart = user.firstname.charAt(0).toUpperCase();
    const lastNamePart = user.lastname.charAt(0).toUpperCase();
    return firstNamePart + lastNamePart;
};

// Add a new member to the form
const addMember = () => {
    groupForm.value.members.push({
        id: Date.now().toString(), // Temporary ID
        name: '',
        email: ''
    });
};

// Remove a member from the form
const removeMember = (index: number) => {
    const member = groupForm.value.members[index];

    // Don't allow removing the creator
    if (member.id === group.value?.createdBy) {
        return;
    }

    groupForm.value.members.splice(index, 1);
};

// Inline members management (persist changes)
const addMemberInline = async () => {
    if (!group.value || !newMember.value.email) return;
    modalLoading.value = true;
    try {
        const member: User = {
            id: Date.now().toString(),
            firstname: newMember.value.firstname || '',
            lastname: newMember.value.lastname || '',
            username: (newMember.value.email.split('@')[0] || '').toLowerCase(),
            email: newMember.value.email,
            createdAt: new Date().toISOString()
        } as User;

        const updatedMembers = [...group.value.members, member];
        const updated = await groupStore.updateGroup(
            group.value.id,
            group.value.name,
            updatedMembers,
            group.value.background || ''
        );
        if (updated) {
            group.value = updated;
            // reset form
            newMember.value = {firstname: '', lastname: '', email: ''};
        } else if (groupStore.error) {
            error.value = groupStore.error;
        }
    } catch (e) {
        console.error('Failed to add member:', e);
        error.value = 'Failed to add member. Please try again.';
    } finally {
        modalLoading.value = false;
    }
};

const removeMemberInline = async (memberId: string) => {
    if (!group.value) return;
    if (memberId === group.value.createdBy) return; // protect creator
    modalLoading.value = true;
    try {
        const updatedMembers = group.value.members.filter(m => m.id !== memberId);
        const updated = await groupStore.updateGroup(
            group.value.id,
            group.value.name,
            updatedMembers,
            group.value.background || ''
        );
        if (updated) {
            group.value = updated;
        } else if (groupStore.error) {
            error.value = groupStore.error;
        }
    } catch (e) {
        console.error('Failed to remove member:', e);
        error.value = 'Failed to remove member. Please try again.';
    } finally {
        modalLoading.value = false;
    }
};

// Handle group form submission
const handleSubmitGroup = async (payload?: { name: string; background?: string; members: User[] }) => {
    if (!groupForm.value.name || !group.value) return;

    modalLoading.value = true;

    try {
        // Use payload values
        const name = payload?.name ?? groupForm.value.name;
        const validMembers = payload?.members ?? [];
        const background = payload?.background ?? groupForm.value.background;

        // Update group
        const updatedGroup = await groupStore.updateGroup(
            group.value.id,
            name,
            validMembers,
            background
        );

        if (updatedGroup) {
            group.value = updatedGroup;
            closeModals();
        } else {
            error.value = groupStore.error || 'Failed to update group';
        }
    } catch (err) {
        console.error('Failed to update group:', err);
        error.value = 'Failed to update group. Please try again.';
    } finally {
        modalLoading.value = false;
    }
};

// Handle event form submission
const handleSubmitEvent = async (payload?: { id?: string; name: string; date: string; background?: string; scope?: 'single' | 'multiple'; targetPersonId?: string }) => {
    const hasPayload = !!payload && !!payload.name && !!payload.date
    const hasForm = !!eventForm.value.name && !!eventForm.value.date
    if (!hasPayload && !hasForm) return;

    modalLoading.value = true;

    try {
        // Create event
        const name = payload?.name ?? eventForm.value.name
        const date = payload?.date ?? eventForm.value.date
        const newEvent = await eventStore.createEvent(
            name,
            date,
            groupId,
            payload?.scope,
            payload?.targetPersonId
        );

        if (newEvent) {
            events.value.push(newEvent);
            closeModals();
        } else {
            error.value = eventStore.error || 'Failed to create event';
        }
    } catch (err) {
        console.error('Failed to create event:', err);
        error.value = 'Failed to create event. Please try again.';
    } finally {
        modalLoading.value = false;
    }
};

// Handle delete event
const handleDeleteEvent = (eventId: string) => {
    currentEventId.value = eventId;
    showDeleteModal.value = true;
};

// Confirm delete event
const confirmDeleteEvent = async () => {
    if (!currentEventId.value) return;

    modalLoading.value = true;

    try {
        const success = await eventStore.deleteEvent(currentEventId.value);

        if (success) {
            // Remove the event from the local state
            events.value = events.value.filter(event => event.id !== currentEventId.value);
            showDeleteModal.value = false;
        } else {
            error.value = eventStore.error || 'Failed to delete event';
        }
    } catch (err) {
        console.error('Failed to delete event:', err);
        error.value = 'Failed to delete event. Please try again.';
    } finally {
        modalLoading.value = false;
    }
};

// Close all modals and reset forms
const closeModals = () => {
    showCreateEventModal.value = false;
    showEditGroupModal.value = false;
    showDeleteModal.value = false;

    // Reset event form
    eventForm.value = {
        name: '',
        date: new Date().toISOString().split('T')[0],
    };

    // Reset group form to current group data
    if (group.value) {
        groupForm.value = {
            name: group.value.name,
            background: group.value.background || '',
            members: [...group.value.members]
        };
    }

    currentEventId.value = '';
};
</script>
