import {defineStore} from 'pinia';
import type {User} from '~/types';

export const useUserStore = defineStore('user', {
    state: () => ({
        currentUser: null as User | null,
        isAuthenticated: false,
        loading: false,
        error: null as string | null,
    }),

    getters: {
        user: (state) => state.currentUser,
        isLoggedIn: (state) => state.isAuthenticated,
        isAdmin: (state) => state.currentUser?.isAdmin === true,
    },

    actions: {
        // Initialize user from localStorage (for "Remember me" functionality)
        init() {
            try {
                const storedUser = localStorage.getItem('user');
                const isAuthenticated = localStorage.getItem('isAuthenticated');

                if (storedUser && isAuthenticated === 'true') {
                    this.currentUser = JSON.parse(storedUser);
                    this.isAuthenticated = true;
                }
            } catch (error) {
                console.error('Failed to initialize user from localStorage:', error);
            }
        },
        async login(username: string, password: string) {
            this.loading = true;
            this.error = null;
            try {
                //call the API to authenticate user api/auth/login
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({username, password}),
                });

                if (!response.ok) {
                    this.error = 'Invalid username or password';
                    this.loading = false;
                    return false;
                }
                const data = await response.json();
                this.currentUser = data as User;
                this.isAuthenticated = true;

                localStorage.setItem('user', JSON.stringify(this.currentUser));
                localStorage.setItem('isAuthenticated', 'true');

                return true;
            } catch (error) {
                this.error = 'Failed to login';
                return false;
            } finally {
                this.loading = false;
            }
        },
        async logout() {
            this.loading = true;

            try {
                this.currentUser = null;
                this.isAuthenticated = false;

                // Clear localStorage
                localStorage.removeItem('user');
                localStorage.removeItem('isAuthenticated');
                return true;
            } catch (error) {
                this.error = 'Failed to logout';
                return false;
            } finally {
                this.loading = false;
            }
        },
        async register(firstname: string, lastname: string, username: string, email: string, password: string, avatar?: string) {
            this.loading = true;
            this.error = null;

            try {
                // Call the API to register user api/auth/register
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({firstname, lastname, username, email, password, avatar}),
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    this.error = errorData.statusMessage ?? 'Registration failed';
                    this.loading = false;
                    return false;
                }
                const data = await response.json();
                this.currentUser = {
                    id: data.id,
                    firstname: data.firstname,
                    lastname: data.lastname,
                    username: data.username,
                    email: data.email,
                    avatar: data.avatar ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(data.username)}&background=6366F1&color=fff`, // Default avatar
                    isAdmin: data.isAdmin ?? false, // Default to false for regular users
                };
                this.isAuthenticated = true;

                return true;
            } catch (error) {
                this.error = 'Failed to register';
                return false;
            } finally {
                this.loading = false;
            }
        },

        async fetchAllUsers() {
            this.loading = true;
            this.error = null;

            try {
                const response = await fetch('/api/user');
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const users = await response.json();
                return users;
            } catch (error: any) {
                this.error = error.message || 'Failed to fetch users';
                return [];
            } finally {
                this.loading = false;
            }
        },

        // Update user avatar
        async updateAvatar(avatarUrl: string) {
            this.loading = true;
            this.error = null;

            try {
                const response = await fetch(`/api/user/${this.currentUser?.id}/avatar`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({avatar: avatarUrl}),
                });

                if (this.currentUser) {
                    this.currentUser = {
                        ...this.currentUser,
                        avatar: avatarUrl
                    };
                    return true;
                }

                this.error = 'User not authenticated';
                return false;
            } catch (error) {
                this.error = 'Failed to update avatar';
                return false;
            } finally {
                this.loading = false;
            }
        }
    },
});
