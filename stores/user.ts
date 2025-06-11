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
    // Simulate login
    async login(email: string, password: string) {
      this.loading = true;
      this.error = null;

      try {
        //call the API to authenticate user api/auth/login
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          this.error = 'Invalid email or password';
          this.loading = false;
          return false;
        }
        const data = await response.json();
        this.currentUser = {
          id: data.id,
          name: data.name,
          email: data.email,
          avatar: data.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=6366F1&color=fff`, // Default avatar
          isAdmin: data.isAdmin || false,
        };

        console.log('User logged in:', this.currentUser);
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
          this.error = errorData.message || 'Registration failed';
          this.loading = false;
          return false;
        }
        console.log('Registration response:', response);
        const data = await response.json();
        this.currentUser = {
          id: data.id,
          name: data.name,
          email: data.email,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=6366F1&color=fff`, // Default avatar
          isAdmin: false, // Default to false for regular users
        };
        this.isAuthenticated = true;
        console.log('User registered:', this.currentUser);

        return true;
      } catch (error) {
        this.error = 'Failed to register';
        return false;
      } finally {
        this.loading = false;
      }
    },

    // Initialize user from session/local storage
  initUser(asAdmin = false) {
    // For demo purposes, we'll just set a mock user
    this.currentUser = {
      id: '1',
      name: asAdmin ? 'Admin User' : 'John Doe',
      email: asAdmin ? 'admin@example.com' : 'john@example.com',
      avatar: asAdmin 
        ? 'https://ui-avatars.com/api/?name=Admin+User&background=FF5722&color=fff'
        : 'https://ui-avatars.com/api/?name=John+Doe&background=6366F1&color=fff', // Default avatar
      isAdmin: asAdmin,
    };
    this.isAuthenticated = true;
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
