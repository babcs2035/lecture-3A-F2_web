// https://nuxt.com/docs/api/configuration/nuxt-config
const APP_MODE = process.env.APP_MODE || "local";
const baseURL = APP_MODE === "local" ? "/" : "/energy-track/";
const fullURL = APP_MODE === "local" ? "http://localhost:3000" : "https://ktak.dev/energy-track";
process.env.TZ = "Asia/Tokyo";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      APP_MODE,
      baseURL,
      fullURL,
    },
  },
  ssr: false,
  css: ["@/assets/styles/common.scss"],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
          additionalData: `@use "@/assets/styles/main.scss" as *;`,
        },
      },
    },
    build: {
      target: ["esnext", "es2022"],
    },
    esbuild: {
      target: "es2022",
    },
    optimizeDeps: {
      esbuildOptions: {
        target: "es2022",
      },
    },
  },
  modules: ["@nuxt/eslint", "vuetify-nuxt-module", "nuxt-vuefire", "@vite-pwa/nuxt", "@nuxtjs/leaflet"],
  vuefire: {
    config: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.FIREBASE_DATABASE_URL,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
    },
    services: {
      database: true,
    },
  },
  app: {
    baseURL,
    head: {
      link: [
        { rel: "icon", type: "image/x-icon", href: fullURL + "/favicon.ico" },
        { rel: "apple-touch-icon", sizes: "180x180", href: fullURL + "/apple-touch-icon.png" },
        { rel: "icon", type: "image/png", sizes: "192x192", href: fullURL + "/android-touch-icon.png" },
      ],
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "title", content: "Energy Track" },
        // { name: "description", content: "" },
        { name: "apple-mobile-web-app-title", content: "Energy Track" },
        // { name: "thumbnail", content: ogImage },
        { property: "og:title", content: "Energy Track" },
        { property: "og:site_name", content: "Energy Track" },
        // { property: "og:description", content: "" },
        // { property: "og:image", content: ogImage },
        { property: "og:type", content: "website" },
        { property: "og:url", content: fullURL },
      ],
    },
  },
  nitro: {
    prerender: {
      failOnError: false,
    },
  },
  pwa: {
    registerType: "autoUpdate",
    manifest: {
      "name": "Energy Track",
      "short_name": "Energy Track",
      "icons": [
        {
          "src": "icons/icon-48x48.png",
          "sizes": "48x48",
          "type": "image/png"
        },
        {
          "src": "icons/icon-72x72.png",
          "sizes": "72x72",
          "type": "image/png"
        },
        {
          "src": "icons/icon-96x96.png",
          "sizes": "96x96",
          "type": "image/png"
        },
        {
          "src": "icons/icon-128x128.png",
          "sizes": "128x128",
          "type": "image/png"
        },
        {
          "src": "icons/icon-144x144.png",
          "sizes": "144x144",
          "type": "image/png"
        },
        {
          "src": "icons/icon-152x152.png",
          "sizes": "152x152",
          "type": "image/png"
        },
        {
          "src": "icons/icon-192x192.png",
          "sizes": "192x192",
          "type": "image/png"
        },
        {
          "src": "icons/icon-256x256.png",
          "sizes": "256x256",
          "type": "image/png"
        },
        {
          "src": "icons/icon-384x384.png",
          "sizes": "384x384",
          "type": "image/png"
        },
        {
          "src": "icons/icon-512x512.png",
          "sizes": "512x512",
          "type": "image/png"
        }
      ],
      "start_url": baseURL,
      "display": "standalone",
      "background_color": "#E9F5FB",
      "theme_color": "#E9F5FB"
    },
    workbox: {
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
      navigateFallback: baseURL
    },
    client: {
      installPrompt: true,
      // you don"t need to include this: only for testing purposes
      // if enabling periodic sync for update use 1 hour or so (periodicSyncForUpdates: 3600)
      periodicSyncForUpdates: 3600,
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallbackAllowlist: [/^\/$/],
      type: "module",
    },
  }
})
