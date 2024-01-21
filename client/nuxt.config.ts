import { compression } from "vite-plugin-compression2";

const _title = "컷인 | 우리의 농구를 더욱 특별하게";
const _desc = "농구 영상 편집 & 스탯 기록 & 배포를 쉽게 하는 플랫폼";

export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: true,
  app: {
    head: {
      htmlAttrs: { lang: "ko" },
      charset: "utf-8",
      viewport:
        "user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, width=device-width",
      title: _title,
      meta: [
        { hid: "description", name: "description", content: _desc },
        { hid: "og:title", property: "og:title", content: _title },
        { hid: "og:description", property: "og:description", content: _desc },
        {
          hid: "og:image",
          property: "og:image",
          content: "https://cutin.cc/og-image.png",
        },
        { hid: "og:url", property: "og:url", content: `https://cutin.cc` },
      ],
      link: [
        { rel: "icon", type: "image/png", href: "/favicon.ico" },
        { rel: "apple-touch-icon", href: "/og-image.png" },
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
  modules: [
    "nuxt-quasar-ui",
    "@vite-pwa/nuxt",
    "nuxt-gtag",
    "@nuxtjs/google-adsense",
    "@nuxt/content",
  ],
  gtag: {
    id: "G-J9Z1XZREM2",
  },
  // googleAdsense: {
  //   id: "ca-pub-7259356170238927",
  // },
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
  runtimeConfig: {
    public: {
      siteUrl: "https://cutin.cc",
      trailingSlash: true,
      titleSeparator: "",
      siteName: " ",
      siteDescription: _desc,
      language: "ko",
    },
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
    server: { hmr: { overlay: false } },
  },
  watch: ["server/api/upload.js"],
});
