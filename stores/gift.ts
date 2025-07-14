import {defineStore} from 'pinia';
import type {Gift, Reservation} from '~/types';
import {useUserStore} from './index';

export const useGiftStore = defineStore('gift', {
    state: () => ({
        gifts: [] as Gift[],
        reservations: [] as Reservation[],
        loading: false,
        error: null as string | null,
    }),

    getters: {
        getGiftsByEventId: (state) => (eventId: string) => {
            return state.gifts.filter(gift => gift.eventId === eventId);
        },

        getGiftById: (state) => (id: string) => {
            return state.gifts.find(gift => gift.id === id) || null;
        },

        isGiftReserved: (state) => (giftId: string) => {
            return state.reservations.some(reservation => reservation.giftId === giftId);
        },

        getReservationByGiftId: (state) => (giftId: string) => {
            return state.reservations.find(reservation => reservation.giftId === giftId) || null;
        }
    },

    actions: {
        // Add a new gift (alias for createGift)
        async addGift(gift: Omit<Gift, 'id'>) {
            return this.createGift(gift);
        },

        // Fetch all gifts for a specific event
        async fetchGiftsByEventId(eventId: string) {
            this.loading = true;
            this.error = null;

            try {
                const userStore = useUserStore();
                const userId = userStore.currentUser?.id;

                // Call the API to get gifts for the event
                const response = await fetch(`/api/gifts?eventId=${eventId}&userId=${userId}`);
                const data = await response.json();

                if (data.error) {
                    this.error = data.error;
                    return [];
                }

                // No need to convert from snake_case to camelCase - middleware handles it
                // Just convert IDs to strings
                const gifts = data.map((gift: any) => ({
                    ...gift,
                    id: gift.id.toString(),
                    eventId: gift.eventId.toString(),
                    createdBy: gift.createdBy.toString()
                }));

                // Update state with the gifts
                this.gifts = [...this.gifts.filter(g => g.eventId !== eventId), ...gifts];

                // Create reservations from gifts data
                const newReservations = gifts
                    .filter(gift => gift.reservedBy)
                    .map(gift => ({
                        giftId: gift.id,
                        reservedBy: gift.reservedBy as string,
                        reservedAt: new Date().toISOString()
                    }));

                // Update reservations state
                this.reservations = [
                    ...this.reservations.filter(r => !gifts.some(g => g.id === r.giftId)),
                    ...newReservations
                ];

                return gifts;
            } catch (error) {
                this.error = 'Failed to fetch gifts';
                return [];
            } finally {
                this.loading = false;
            }
        },

        // Fetch all gifts (no event filter)
        async fetchAllGifts() {
            this.loading = true;
            this.error = null;

            try {
                // Call the API to get all gifts
                const response = await fetch('/api/gifts');
                const data = await response.json();

                if (data.error) {
                    this.error = data.error;
                    return [];
                }

                // No need to convert from snake_case to camelCase - middleware handles it
                // Just convert IDs to strings
                const gifts = data.map((gift: Gift) => ({
                    ...gift,
                    id: gift.id.toString(),
                    eventId: gift.eventId.toString(),
                    createdBy: gift.createdBy.toString(),
                    createdAt: gift.createdAt || new Date().toISOString(),
                }));

                // Update state with the gifts
                this.gifts = gifts;

                return gifts;
            } catch (error) {
                this.error = 'Failed to fetch gifts';
                return [];
            } finally {
                this.loading = false;
            }
        },

        // Fetch a single gift by ID
        async fetchGift(id: string) {
            this.loading = true;
            this.error = null;

            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 500));

                // Check if gift is already in state
                const gift = this.getGiftById(id);

                if (gift) {
                    return gift;
                }

                // If not in state, mock fetch from API
                const mockGift = {
                    id,
                    title: `Gift ${id}`,
                    link: 'https://example.com',
                    image: 'https://placehold.co/300x200',
                    price: 99.99,
                    reservedBy: undefined,
                    eventId: '1',
                    createdBy: '1'
                };

                this.gifts.push(mockGift);

                return mockGift;
            } catch (error) {
                this.error = 'Failed to fetch gift';
                return null;
            } finally {
                this.loading = false;
            }
        },

        // Create a new gift
        async createGift(gift: Omit<Gift, 'id'>) {
            this.loading = true;
            this.error = null;

            try {
                const userStore = useUserStore();
                const userId = userStore.currentUser?.id;

                if (!userId) {
                    this.error = 'User not authenticated';
                    return null;
                }

                // Prepare the gift data for the API
                const giftData = {
                    title: gift.title,
                    link: gift.link,
                    image: gift.image,
                    price: gift.price,
                    eventId: gift.eventId,
                    createdBy: userId
                };

                // Call the API to create the gift
                const response = await fetch('/api/gifts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(giftData)
                });

                const data = await response.json();

                if (!response.ok) {
                    this.error = data.message || 'Failed to create gift';
                    return null;
                }

                // No need to convert from snake_case to camelCase - middleware handles it
                // Just convert IDs to strings
                const newGift: Gift = {
                    ...data,
                    id: data.id.toString(),
                    eventId: data.eventId.toString(),
                    createdBy: data.createdBy.toString()
                };

                // Add the new gift to the store
                this.gifts.push(newGift);
                return newGift;
            } catch (error) {
                this.error = 'Failed to create gift';
                return null;
            } finally {
                this.loading = false;
            }
        },

        // Update an existing gift
        async updateGift(id: string, giftData: Partial<Omit<Gift, 'id' | 'createdBy' | 'eventId'>>) {
            this.loading = true;
            this.error = null;

            try {
                const userStore = useUserStore();
                const userId = userStore.currentUser?.id;

                if (!userId) {
                    this.error = 'User not authenticated';
                    return null;
                }

                // Prepare the gift data for the API
                const updateData = {
                    ...giftData,
                    createdBy: userId
                };

                // Call the API to update the gift
                const response = await fetch(`/api/gifts/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updateData)
                });

                const data = await response.json();

                if (!response.ok) {
                    this.error = data.message || 'Failed to update gift';
                    return null;
                }

                // No need to convert from snake_case to camelCase - middleware handles it
                // Just convert IDs to strings
                const updatedGift: Gift = {
                    ...data,
                    id: data.id.toString(),
                    eventId: data.eventId.toString(),
                    createdBy: data.createdBy.toString()
                };

                // Update the gift in the store
                const giftIndex = this.gifts.findIndex(gift => gift.id === id);
                if (giftIndex !== -1) {
                    this.gifts[giftIndex] = updatedGift;
                }

                return updatedGift;
            } catch (error) {
                this.error = 'Failed to update gift';
                return null;
            } finally {
                this.loading = false;
            }
        },

        // Delete a gift
        async deleteGift(id: string) {
            this.loading = true;
            this.error = null;

            try {
                const userStore = useUserStore();
                const userId = userStore.currentUser?.id;

                if (!userId) {
                    this.error = 'User not authenticated';
                    return false;
                }

                // Call the API to delete the gift
                const response = await fetch(`/api/gifts/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({createdBy: userId})
                });

                const data = await response.json();

                if (!response.ok) {
                    this.error = data.message || 'Failed to delete gift';
                    return false;
                }

                // Remove the gift from the store
                const giftIndex = this.gifts.findIndex(gift => gift.id === id);
                if (giftIndex !== -1) {
                    this.gifts.splice(giftIndex, 1);
                }

                // Remove any reservations for this gift
                const reservationIndex = this.reservations.findIndex(reservation => reservation.giftId === id);
                if (reservationIndex !== -1) {
                    this.reservations.splice(reservationIndex, 1);
                }

                return true;
            } catch (error) {
                this.error = 'Failed to delete gift';
                return false;
            } finally {
                this.loading = false;
            }
        },

        // Reserve a gift
        async reserveGift(giftId: string, name: string) {
            this.loading = true;
            this.error = null;

            try {
                if (!name) {
                    this.error = 'Name is required';
                    return false;
                }

                // Call the API to reserve the gift
                const response = await fetch(`/api/gifts/${giftId}/reserve`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({reservedBy: name})
                });

                const data = await response.json();

                if (!response.ok) {
                    this.error = data.message || 'Failed to reserve gift';
                    return false;
                }

                // Create reservation
                const reservation: Reservation = {
                    giftId,
                    reservedBy: name,
                    reservedAt: new Date().toISOString()
                };

                // Add the reservation to the store
                this.reservations.push(reservation);

                // Update gift with reservation info
                const giftIndex = this.gifts.findIndex(gift => gift.id === giftId);
                if (giftIndex !== -1) {
                    this.gifts[giftIndex] = {
                        ...this.gifts[giftIndex],
                        reservedBy: name
                    };
                }

                return true;
            } catch (error) {
                this.error = 'Failed to reserve gift';
                return false;
            } finally {
                this.loading = false;
            }
        },

        // Cancel a gift reservation
        async cancelReservation(giftId: string) {
            this.loading = true;
            this.error = null;

            try {
                // Call the API to cancel the reservation
                const response = await fetch(`/api/gifts/${giftId}/reserve`, {
                    method: 'DELETE'
                });

                const data = await response.json();

                if (!response.ok) {
                    this.error = data.message || 'Failed to cancel reservation';
                    return false;
                }

                // Remove reservation from the store
                const reservationIndex = this.reservations.findIndex(reservation => reservation.giftId === giftId);
                if (reservationIndex !== -1) {
                    this.reservations.splice(reservationIndex, 1);
                }

                // Update gift to remove reservation info
                const giftIndex = this.gifts.findIndex(gift => gift.id === giftId);
                if (giftIndex !== -1) {
                    this.gifts[giftIndex] = {
                        ...this.gifts[giftIndex],
                        reservedBy: undefined
                    };
                }

                return true;
            } catch (error) {
                this.error = 'Failed to cancel reservation';
                return false;
            } finally {
                this.loading = false;
            }
        },

        // Get public gifts for an event (no authentication required)
        async getPublicGiftsByEventId(eventId: string) {
            this.loading = true;
            this.error = null;

            try {
                // Call the API to get gifts for the event (public view)
                const response = await fetch(`/api/gifts?eventId=${eventId}`);
                const data = await response.json();

                if (data.error) {
                    this.error = data.error;
                    return [];
                }

                // No need to convert from snake_case to camelCase - middleware handles it
                // Just convert IDs to strings and handle special fields
                const gifts = data.map((gift: any) => ({
                    ...gift,
                    id: gift.id.toString(),
                    isReserved: !!gift.reservedBy, // Convert to boolean
                    reservedBy: undefined, // Hide who reserved it
                    eventId: gift.eventId.toString(),
                    createdBy: gift.createdBy.toString()
                }));

                return gifts;
            } catch (error) {
                this.error = 'Failed to fetch public gifts';
                return [];
            } finally {
                this.loading = false;
            }
        }
    }
});
