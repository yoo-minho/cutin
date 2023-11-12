import { compression } from "vite-plugin-compression2";

export default defineNuxtConfig({
  devtools: { enabled: false },
  app: {
    head: {
      link: [],
    },
  },
  modules: ["nuxt-quasar-ui"],
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
