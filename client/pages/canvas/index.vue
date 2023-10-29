<script setup lang="ts">
const height = 720;
const fontSize = 72;
const zoomX = 48;
const zoomY = height - 48;
const zoomFontSize = fontSize;
const borderSize = zoomFontSize * 0.3;

const text = "안녕2222222222222222222";
const canvas = ref(null);

onMounted(() => {
  console.log({ canvas });
  const canvasContext = canvas.value.getContext("2d");
  canvasContext.font = `${fontSize}px Giants-Bold`; // 원하는 폰트 및 크기로 설정
  const textWidth = canvasContext.measureText(text).width;

  canvasContext.fillStyle = "white";
  roundRect(
    canvasContext,
    zoomX,
    zoomY - zoomFontSize,
    textWidth + borderSize,
    zoomFontSize + borderSize,
    borderSize
  );

  canvasContext.fillStyle = "black";
  canvasContext.fillText(text, zoomX, zoomY);
});
</script>
<template>
  <canvas
    id="baseCanvas"
    style="width: 960px; height: 540px; background-color: chartreuse"
    width="1280"
    height="720"
    ref="canvas"
  ></canvas>
</template>

<style lang="scss" scoped>
@font-face {
  font-family: "Giants-Bold";
  src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2307-1@1.1/Giants-Bold.woff2")
    format("woff2");
  font-weight: 700;
  font-style: normal;
}
</style>
