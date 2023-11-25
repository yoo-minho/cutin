<script setup lang="ts">
const route = useRoute();
</script>
<template>
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
  font-weight: 900;
  line-height: 24px;
  margin: 0;
  display: inline-block;
}
</style>
