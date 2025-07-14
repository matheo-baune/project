// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  // Enable server middleware for case conversion
  nitro: {
    experimental: {
      openAPI: true
    }
  },

  // Modules required for the gift list application
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    'nuxt-icon',
    '@nuxtjs/google-fonts',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
  ],

  // i18n configuration
  i18n: {
    locales: [
      { code: 'en', language: 'en-US', file: 'en.json', name: 'English' },
      { code: 'fr', language: 'fr-FR', file: 'fr.json', name: 'Français' },
      { code: 'es', language: 'es-ES', file: 'es.json', name: 'Español' }
    ],
    bundle: {
      optimizeTranslationDirective: false,
    },
    defaultLocale: 'en',
    strategy: 'no_prefix',
    langDir: 'locales',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_lang',
      redirectOn: 'root',
      alwaysRedirect: true,
      fallbackLocale: 'en'
    },
  },

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
