import { defineStore } from 'pinia';
import type { Event } from '~/types';
import { useUserStore } from './user';
import { useGroupStore } from './group';

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
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const userStore = useUserStore();
        const groupStore = useGroupStore();
        const userId = userStore.currentUser?.id;
        
        if (!userId) {
          this.error = 'User not authenticated';
          return [];
        }
        
        // Check if user is a member of the group
        const group = groupStore.getGroupById(groupId);
        if (!group) {
          this.error = 'Group not found';
          return [];
        }
        
        const isMember = group.members.some(member => member.id === userId);
        if (!isMember) {
          this.error = 'Not authorized to view events for this group';
          return [];
        }
        
        // Mock events data
        const mockEvents = [
          {
            id: '1',
            name: 'Christmas 2023',
            date: '2023-12-25',
            groupId: '1',
            createdBy: '1'
          },
          {
            id: '2',
            name: 'Birthday Party',
            date: '2023-11-15',
            groupId: '1',
            createdBy: '1'
          },
          {
            id: '3',
            name: 'Summer BBQ',
            date: '2023-07-04',
            groupId: '2',
            createdBy: '1'
          },
          {
            id: '4',
            name: 'Office Party',
            date: '2023-12-20',
            groupId: '3',
            createdBy: '1'
          }
        ];
        
        // Filter events for the specified group
        const groupEvents = mockEvents.filter(event => event.groupId === groupId);
        
        // Update state with all events (for caching purposes)
        this.events = mockEvents;
        
        return groupEvents;
      } catch (error) {
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
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check if event is already in state
        const event = this.getEventById(id);
        
        if (event) {
          this.currentEvent = event;
          return event;
        }
        
        // If not in state, mock fetch from API
        const mockEvent = {
          id,
          name: `Event ${id}`,
          date: new Date().toISOString().split('T')[0],
          groupId: '1',
          createdBy: '1'
        };
        
        this.events.push(mockEvent);
        this.currentEvent = mockEvent;
        
        return mockEvent;
      } catch (error) {
        this.error = 'Failed to fetch event';
        return null;
      } finally {
        this.loading = false;
      }
    },

    // Create a new event
    async createEvent(name: string, date: string, groupId: string) {
      this.loading = true;
      this.error = null;
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const userStore = useUserStore();
        const groupStore = useGroupStore();
        const userId = userStore.currentUser?.id;
        
        if (!userId) {
          this.error = 'User not authenticated';
          return null;
        }
        
        // Check if user is a member of the group
        const group = groupStore.getGroupById(groupId);
        if (!group) {
          this.error = 'Group not found';
          return null;
        }
        
        const isMember = group.members.some(member => member.id === userId);
        if (!isMember) {
          this.error = 'Not authorized to create events for this group';
          return null;
        }
        
        // Create new event
        const newEvent: Event = {
          id: Date.now().toString(), // Generate a unique ID
          name,
          date,
          groupId,
          createdBy: userId
        };
        
        this.events.push(newEvent);
        return newEvent;
      } catch (error) {
        this.error = 'Failed to create event';
        return null;
      } finally {
        this.loading = false;
      }
    },

    // Update an existing event
    async updateEvent(id: string, name: string, date: string) {
      this.loading = true;
      this.error = null;
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const eventIndex = this.events.findIndex(event => event.id === id);
        
        if (eventIndex === -1) {
          this.error = 'Event not found';
          return null;
        }
        
        const userStore = useUserStore();
        const userId = userStore.currentUser?.id;
        
        // Check if user is the creator of the event
        if (this.events[eventIndex].createdBy !== userId) {
          this.error = 'Not authorized to update this event';
          return null;
        }
        
        // Update event
        this.events[eventIndex] = {
          ...this.events[eventIndex],
          name,
          date
        };
        
        if (this.currentEvent?.id === id) {
          this.currentEvent = this.events[eventIndex];
        }
        
        return this.events[eventIndex];
      } catch (error) {
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
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 600));
        
        const eventIndex = this.events.findIndex(event => event.id === id);
        
        if (eventIndex === -1) {
          this.error = 'Event not found';
          return false;
        }
        
        const userStore = useUserStore();
        const userId = userStore.currentUser?.id;
        
        // Check if user is the creator of the event
        if (this.events[eventIndex].createdBy !== userId) {
          this.error = 'Not authorized to delete this event';
          return false;
        }
        
        // Delete event
        this.events.splice(eventIndex, 1);
        
        if (this.currentEvent?.id === id) {
          this.currentEvent = null;
        }
        
        return true;
      } catch (error) {
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
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check if event is already in state
        const event = this.getEventById(id);
        
        if (event) {
          return event;
        }
        
        // If not in state, mock fetch from API
        const mockEvent = {
          id,
          name: `Event ${id}`,
          date: new Date().toISOString().split('T')[0],
          groupId: '1',
          createdBy: '1'
        };
        
        // Don't add to state since this is a public view
        return mockEvent;
      } catch (error) {
        this.error = 'Failed to fetch public event';
        return null;
      } finally {
        this.loading = false;
      }
    }
  }
});