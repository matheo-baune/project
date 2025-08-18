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

  // Global CSS (Tailwind entry)
  css: ['~/assets/css/tailwind.css'],

  // PostCSS configuration for Tailwind (no Nuxt Tailwind module)
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {},
    },
  },

  // Modules required for the gift list application (without @nuxtjs/tailwindcss)
  modules: [
    '@nuxt/image',
    'nuxt-icon',
    '@nuxtjs/google-fonts',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@nuxt/ui',
  ],

  // i18n configuration
  i18n: {
    locales: [
      { code: 'en', language: 'en-US', file: 'en.json', name: 'English' },
      { code: 'fr', language: 'fr-FR', file: 'fr.json', name: 'Français' },
      { code: 'es', language: 'es-ES', file: 'es.json', name: 'Español' },
      { code: 'ja', language: 'ja-JP', file: 'ja.json', name: '日本語' }
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
      link: [
        { rel: 'icon', type: 'image/x-icon', href: 'https://nuxt.com/assets/design-kit/icon-white.png' },
      ],
      meta: [
        { name: 'description', content: 'A gift list management application for groups' }
      ],
    }
  }
})
