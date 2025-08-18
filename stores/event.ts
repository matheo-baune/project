import { defineStore } from 'pinia';
import type { Event } from '~/types';
import { useUserStore } from '~/stores';

export const useEventStore = defineStore('event', {
  state: () => ({
    events: [] as Event[],
    currentEvent: null as Event | null,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    getEventsByGroupId: (state) => (groupId: string) => {
      return state.events.filter(event => event.groupId === groupId);
    },

    getEventById: (state) => (id: string) => {
      return state.events.find(event => event.id === id) || null;
    },

    getUserEvents: (state) => {
      const userStore = useUserStore();
      const userId = userStore.currentUser?.id;

      if (!userId) return [];

      // Return events created by the user
      return state.events.filter(event => event.createdBy === userId);
    }
  },

  actions: {
    // Fetch all events for a specific group
    async fetchEventsByGroupId(groupId: string) {
      this.loading = true;
      this.error = null;

      try {
        const userStore = useUserStore();
        const userId = userStore.currentUser?.id;

        if (!userId) {
          this.error = 'User not authenticated';
          return [];
        }

        // Make API call to get events for the group
        const { data, error } = await useFetch(`/api/groups/${groupId}/events`, {
          method: 'GET',
          query: {
            userId
          }
        });

        if (error.value) {
          this.error = error.value.statusMessage || 'Failed to fetch events';
          return [];
        }

        if (!data.value) {
          return [];
        }

        // Update state with events
        this.events = [...this.events.filter(event => event.groupId !== groupId), ...data.value];

        return data.value;
      } catch (error) {
        console.error('Error fetching events:', error);
        this.error = 'Failed to fetch events';
        return [];
      } finally {
        this.loading = false;
      }
    },

    // Fetch all events
    async fetchAllEvents() {
      this.loading = true;
      this.error = null;

      try {
        const userStore = useUserStore();
        const userId = userStore.currentUser?.id;

        if (!userId) {
          this.error = 'User not authenticated';
          return [];
        }

        // Make API call to get all events
        const response = await fetch('/api/events', {
          method: 'GET',
        });

        if (!response.ok) {
          this.error = 'Failed to fetch events';
          return [];
        }

        // Update state with events
        const data = await response.json();
        this.events = data as Event[];
        return this.events;
      } catch (error) {
        console.error('Error fetching all events:', error);
        this.error = 'Failed to fetch events';
        return [];
      } finally {
        this.loading = false;
      }
    },

    // Fetch a single event by ID
    async fetchEvent(id: string) {
      this.loading = true;
      this.error = null;

      try {
        // Check if event is already in state
        const event = this.getEventById(id);

        if (event) {
          this.currentEvent = event;
          return event;
        }

        const userStore = useUserStore();
        const userId = userStore.currentUser?.id;

        if (!userId) {
          this.error = 'User not authenticated';
          return null;
        }

        // Make API call to get the event
        const { data, error } = await useFetch(`/api/events/${id}`, {
          method: 'GET',
          query: {
            userId
          }
        });

        if (error.value) {
          this.error = error.value.statusMessage || 'Failed to fetch event';
          return null;
        }

        if (!data.value) {
          this.error = 'Event not found';
          return null;
        }

        // Add to state
        this.events.push(data.value);
        this.currentEvent = data.value;

        return data.value;
      } catch (error) {
        console.error('Error fetching event:', error);
        this.error = 'Failed to fetch event';
        return null;
      } finally {
        this.loading = false;
      }
    },

    // Create a new event
    async createEvent(name: string, date: string, groupId: string, scope?: 'single' | 'multiple', targetPersonId?: string) {
      this.loading = true;
      this.error = null;

      try {
        const userStore = useUserStore();
        const userId = userStore.currentUser?.id;

        if (!userId) {
          this.error = 'User not authenticated';
          return null;
        }

        // Make API call to create the event
        const { data, error } = await useFetch('/api/events', {
          method: 'POST',
          body: {
            name,
            date,
            groupId,
            createdBy: userId,
            scope,
            targetPersonId
          }
        });

        if (error.value) {
          this.error = error.value.statusMessage || 'Failed to create event';
          return null;
        }

        if (!data.value) {
          this.error = 'Failed to create event';
          return null;
        }

        // Add to state
        this.events.push(data.value);
        return data.value;
      } catch (error) {
        console.error('Error creating event:', error);
        this.error = 'Failed to create event';
        return null;
      } finally {
        this.loading = false;
      }
    },

    // Update an existing event
    async updateEvent(id: string, name: string, date: string, background?: string, scope?: 'single' | 'multiple', targetPersonId?: string) {
      this.loading = true;
      this.error = null;

      try {
        const userStore = useUserStore();
        const userId = userStore.currentUser?.id;

        if (!userId) {
          this.error = 'User not authenticated';
          return null;
        }

        // Make API call to update the event
        const { data, error } = await useFetch(`/api/events/${id}`, {
          method: 'PUT',
          body: {
            name,
            date,
            background,
            userId,
            scope,
            targetPersonId
          }
        });

        if (error.value) {
          this.error = error.value.statusMessage || 'Failed to update event';
          return null;
        }

        if (!data.value) {
          this.error = 'Failed to update event';
          return null;
        }

        // Update in state
        const eventIndex = this.events.findIndex(event => event.id === id);
        if (eventIndex !== -1) {
          this.events[eventIndex] = data.value;
        } else {
          this.events.push(data.value);
        }

        if (this.currentEvent?.id === id) {
          this.currentEvent = data.value;
        }

        return data.value;
      } catch (error) {
        console.error('Error updating event:', error);
        this.error = 'Failed to update event';
        return null;
      } finally {
        this.loading = false;
      }
    },

    // Delete an event
    async deleteEvent(id: string) {
      this.loading = true;
      this.error = null;

      try {
        const userStore = useUserStore();
        const userId = userStore.currentUser?.id;

        if (!userId) {
          this.error = 'User not authenticated';
          return false;
        }

        // Make API call to delete the event
        const { data, error } = await useFetch(`/api/events/${id}`, {
          method: 'DELETE',
          query: {
            userId
          }
        });

        if (error.value) {
          this.error = error.value.statusMessage || 'Failed to delete event';
          return false;
        }

        // Remove from state
        const eventIndex = this.events.findIndex(event => event.id === id);
        if (eventIndex !== -1) {
          this.events.splice(eventIndex, 1);
        }

        if (this.currentEvent?.id === id) {
          this.currentEvent = null;
        }

        return true;
      } catch (error) {
        console.error('Error deleting event:', error);
        this.error = 'Failed to delete event';
        return false;
      } finally {
        this.loading = false;
      }
    },

    // Get public event (no authentication required)
    async getPublicEvent(id: string) {
      this.loading = true;
      this.error = null;

      try {
        // Check if event is already in state
        const event = this.getEventById(id);

        if (event) {
          return event;
        }

        // Make API call to get the public event
        const { data, error } = await useFetch(`/api/events/${id}`, {
          method: 'GET',
          query: {
            public: 'true'
          }
        });

        if (error.value) {
          this.error = error.value.statusMessage || 'Failed to fetch public event';
          return null;
        }

        if (!data.value) {
          this.error = 'Event not found';
          return null;
        }

        // Don't add to state since this is a public view
        return data.value;
      } catch (error) {
        console.error('Error fetching public event:', error);
        this.error = 'Failed to fetch public event';
        return null;
      } finally {
        this.loading = false;
      }
    }
  }
});
