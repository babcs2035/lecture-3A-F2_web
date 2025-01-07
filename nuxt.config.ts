// https://nuxt.com/docs/api/configuration/nuxt-config
const APP_MODE = process.env.APP_MODE || "local";
const baseURL = APP_MODE === "local" ? "/" : "/amp-track/";
const fullURL = APP_MODE === "local" ? "http://localhost:3000" : "https://ktak.dev/amp-track";
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
  ssr: true,
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
  modules: ["@nuxt/eslint"],
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
        { name: "title", content: "amp-track" },
        // { name: "description", content: "" },
        { name: "apple-mobile-web-app-title", content: "amp-track" },
        // { name: "thumbnail", content: ogImage },
        { property: "og:title", content: "amp-track" },
        { property: "og:site_name", content: "amp-track" },
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
})
