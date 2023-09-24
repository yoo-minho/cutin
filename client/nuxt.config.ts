// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      script: [
        {
          // src: "https://cdn.jsdelivr.net/npm/pixelmatch@5.3.0",
          async: true, // 비동기로 스크립트를 로드할 수 있도록 설정
          defer: true, // 스크립트를 비동기적으로 로드하고 페이지 구문 분석을 중단하지 않도록 설정
        },
      ],
    },
  },
  devtools: { enabled: false },
  modules: ["nuxt-quasar-ui"],
  quasar: {
    plugins: ["Dialog", "Notify"],
  },
});
