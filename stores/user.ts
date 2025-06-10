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
  },

  actions: {
    // Simulate login
    async login(email: string, password: string) {
      this.loading = true;
      this.error = null;
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock user data
        this.currentUser = {
          id: '1',
          name: 'John Doe',
          email: email,
        };
        
        this.isAuthenticated = true;
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
        return true;
      } catch (error) {
        this.error = 'Failed to logout';
        return false;
      } finally {
        this.loading = false;
      }
    },

    // Simulate registration
    async register(name: string, email: string, password: string) {
      this.loading = true;
      this.error = null;
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock user data
        this.currentUser = {
          id: '1',
          name: name,
          email: email,
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

    // Initialize user from session/local storage
    initUser() {
      // For demo purposes, we'll just set a mock user
      this.currentUser = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
      };
      this.isAuthenticated = true;
    }
  },
});