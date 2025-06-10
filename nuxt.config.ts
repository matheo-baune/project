// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  // Modules required for the gift list application
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    'nuxt-icon',
    '@nuxtjs/google-fonts',
    '@pinia/nuxt',
  ],

  // Google Fonts configuration
  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700],
      Poppins: [400, 500, 600, 700],
    },
    display: 'swap',
  },

  // TypeScript configuration
  typescript: {
    strict: true,
  },

  // Application configuration
  app: {
    head: {
      title: 'Gift List Manager',
      meta: [
        { name: 'description', content: 'A gift list management application for groups' }
      ],
    }
  }
})
