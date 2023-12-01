import { compression } from "vite-plugin-compression2";

export default defineNuxtConfig({
  devtools: { enabled: false },
  app: {
    head: {
      htmlAttrs: { lang: "ko" },
      charset: "utf-8",
      viewport:
        "user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, width=device-width",
      link: [
        { rel: "icon", type: "image/png", href: "favicon.ico" },
        { rel: "apple-touch-icon", href: "og-image.png" },
        {
          rel: "preload",
          as: "font",
          href: "/assets/fonts/NotoSansKR-Black.woff2",
          crossorigin: "anonymous",
        },
        {
          rel: "preload",
          as: "font",
          href: "/assets/fonts/NotoSansKR-Bold.woff2",
          crossorigin: "anonymous",
        },
        {
          rel: "preload",
          as: "font",
          href: "/assets/fonts/NotoSansKR-Medium.woff2",
          crossorigin: "anonymous",
        },
        {
          rel: "preload",
          as: "font",
          href: "/assets/fonts/NotoSansKR-Regular.woff2",
          crossorigin: "anonymous",
        },
      ],
    },
  },
  extends: ["nuxt-seo-kit"],
  modules: ["nuxt-quasar-ui", "@vite-pwa/nuxt", "nuxt-gtag"],
  gtag: {
    id: "G-J9Z1XZREM2",
  },
  pwa: {
    registerType: "autoUpdate",
    injectRegister: "auto", //default
    manifest: {
      name: "cutin",
      short_name: "cutin",
      description: "영상과 함께 농구하자",
      display: "standalone",
      theme_color: "#ffffff",
      background_color: "#ffffff",
      start_url: ".",
      lang: "ko",
      icons: [
        {
          src: "assets/icons/icon-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "maskable any",
        },
        {
          src: "assets/icons/icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable any",
        },
      ],
      orientation: "portrait",
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 20,
    },
  },
  quasar: {
    plugins: ["Dialog", "Notify", "Loading"],
    extras: {
      fontIcons: ["material-icons"],
    },
    sassVariables: "@/assets/global.scss",
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/global.scss" as *;',
        },
      },
    },
    plugins: [compression()],
  },
  watch: ["server/api/upload.js"],
});
