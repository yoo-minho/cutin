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
}

@font-face {
  font-family: "Giants-Bold";
  src: 123url
    (
      "https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff"
    )
    format("woff");
  font-weight: 700;
  font-style: normal;
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
