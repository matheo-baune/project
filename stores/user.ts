import { defineStore } from 'pinia';
import type { User } from '~/types';

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
    // Simulate login
    async login(username: string, password: string, rememberMe: boolean = false) {
      this.loading = true;
      this.error = null;
      console.log('Start Login :', { username, password, rememberMe });
      try {
        //call the API to authenticate user api/auth/login
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        console.log('Login successful:', { username, password, rememberMe });
        if (!response.ok) {
          this.error = 'Invalid username or password';
          this.loading = false;
          return false;
        }
        const data = await response.json();
        this.currentUser = {
          id: data.id,
          name: data.name,
          email: data.username,
          avatar: data.avatar ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(data.username)}&background=6366F1&color=fff`, // Default avatar
          isAdmin: data.isAdmin ?? false,
        };
        this.isAuthenticated = true;

        // If rememberMe is true, store the user data in localStorage
        if (rememberMe) {
          localStorage.setItem('user', JSON.stringify(this.currentUser));
          localStorage.setItem('isAuthenticated', 'true');
        }

        return true;
      } catch (error) {
        this.error = 'Failed to login';
        return false;
      } finally {
        this.loading = false;
      }
    },

    // Simulate logout
    async logout() {
      this.loading = true;

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

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

    // Simulate registration
    async register(name: string, username: string, password: string) {
      this.loading = true;
      this.error = null;

      try {

        console.log('Register attempt 1 :', { name, username, password });
        // Call the API to register user api/auth/register
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, username, password }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          this.error = errorData.message ?? 'Registration failed';
          this.loading = false;
          return false;
        }
        const data = await response.json();
        this.currentUser = {
          id: data.id,
          name: data.name,
          email: data.email,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=6366F1&color=fff`, // Default avatar
          isAdmin: false, // Default to false for regular users
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

    // Update user avatar
    async updateAvatar(avatarUrl: string) {
      this.loading = true;
      this.error = null;

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

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
