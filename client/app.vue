<script setup lang="ts">
const _title = "컷인 | 우리의 농구를 더욱 특별하게";
const _desc = "농구 영상 편집 & 스탯 기록 & 배포를 쉽게 하는 플랫폼";

useHead({
  title: _title,
  meta: [
    { name: "description", content: _desc },
    { property: "og:title", content: _title },
    { property: "og:description", content: _desc },
    { property: "og:type", content: "website" },
    { property: "og:url", content: `https://cutin.cc` },
    { property: "og:locale", content: "ko_KR" },
    { property: "og:image", content: "https://cutin.cc/og-image.png" },
  ],
});

const route = useRoute();
</script>
<template>
  <VitePwaManifest />
  <SeoKit />
  <template v-if="route.path.includes('/watch')">
    <NuxtLayout class="max-width">
      <NuxtPage />
    </NuxtLayout>
  </template>
  <template v-else>
    <NuxtPage />
  </template>
</template>
<style>
body {
  overflow: hidden;
  font-family: "Noto Sans KR", Arial, Helvetica, sans-serif;
}

@font-face {
  font-family: "Noto Sans KR";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(/assets/fonts/NotoSansKR-Regular.woff2) format("woff2");
  unicode-range: U+AC00-D7A3;
}

@font-face {
  font-family: "Noto Sans KR";
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(/assets/fonts/NotoSansKR-Medium.woff2) format("woff2");
  unicode-range: U+AC00-D7A3;
}

@font-face {
  font-family: "Noto Sans KR";
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(/assets/fonts/NotoSansKR-Bold.woff2) format("woff2");
  unicode-range: U+AC00-D7A3;
}

@font-face {
  font-family: "Noto Sans KR";
  font-style: normal;
  font-weight: 900;
  font-display: swap;
  src: url(/assets/fonts/NotoSansKR-Black.woff2) format("woff2");
  unicode-range: U+AC00-D7A3;
}

@font-face {
  font-family: "Giants-Bold";
  src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2307-1@1.1/Giants-Bold.woff2")
    format("woff2");
  font-weight: 700;
  font-style: normal;
}

@font-face {
  font-family: "Pretendard-Regular";
  font-style: normal;
  font-weight: 400;
  src: url("/assets/fonts/Pretendard-Regular.ttf") format("truetype");
}

@font-face {
  font-family: "NanumSquareNeo-Variable";
  src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_11-01@1.0/NanumSquareNeo-Variable.woff2")
    format("woff2");
  font-weight: normal;
  font-style: normal;
}

h1,
h2,
h3 {
  font-size: 20px;
  /* font-weight: 900; */
  line-height: 24px;
  margin: 0;
  display: inline-block;
  font-family: "Noto Sans KR", Arial, Helvetica, sans-serif;
}

.max-width {
  max-width: 460px;
  min-width: 360px;
  margin: 0 auto;
  width: 100vw;
}
</style>
