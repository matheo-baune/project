import { useUserStore } from '~/stores';

export default defineNuxtRouteMiddleware((to) => {
  // Public pages that don't require authentication
  const publicPages = ['/login', '/register'];
  const isPublicPage = publicPages.includes(to.path) || to.path.startsWith('/public/');

  // Skip authentication check for public pages to prevent redirection before authentication
  if (isPublicPage) {
    return;
  }

  // Get authentication status from user store
  // Use useState to access the store safely in middleware
  const isAuthenticated = useState('auth-status', () => {
    try {
      const userStore = useUserStore();
      return userStore.isLoggedIn;
    } catch (error) {
      console.error('Failed to access user store:', error);
      return false;
    }
  }).value;

  // If the page is not public and the user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return navigateTo('/login');
  }
});
