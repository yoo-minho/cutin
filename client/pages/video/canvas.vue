<script setup lang="ts">
const canvas = ref<HTMLCanvasElement>();

onMounted(() => {
  const canvasContext = canvas.value?.getContext("2d");
  if (!canvasContext) return;

  const margin = 32;
  const { top, right } = drawBanner(canvas.value, {
    x: margin,
    y: (canvas.value?.height || 0) - margin,
    text: "화이트     41",
    font: "Giants-Bold",
    fontSize: 32,
    textColor: "black",
    bgColor: "white",
    padding: 8,
  });

  const { right: right2 } = drawBanner(canvas.value, {
    x: right,
    y: (canvas.value?.height || 0) - margin,
    text: "1Q",
    font: "Giants-Bold",
    fontSize: 32,
    textColor: "white",
    bgColor: "grey",
    padding: 8,
  });

  const { right: right3 } = drawBanner(canvas.value, {
    x: right2,
    y: (canvas.value?.height || 0) - margin,
    text: "23    블랙",
    font: "Giants-Bold",
    fontSize: 32,
    textColor: "black",
    bgColor: "white",
    padding: 8,
  });

  drawBanner(canvas.value, {
    x: right3,
    y: (canvas.value?.height || 0) - margin,
    text: "09:10",
    font: "Giants-Bold",
    fontSize: 32,
    textColor: "white",
    bgColor: "black",
    padding: 8,
  });

  drawBanner(canvas.value, {
    x: margin,
    y: top,
    text: "🏀 2023-10-24(토) GBA 동아리 농구경기",
    font: "NanumSquareNeo-Variable",
    fontSize: 16,
    textColor: "white",
    bgColor: "yellowgreen",
    padding: 8,
  });

  drawBanner(canvas.value, {
    xAlign: "right",
    x: (canvas.value?.width || 0) - margin,
    y: (canvas.value?.height || 0) - margin,
    text: "유민호의 득점! 소문혁의 어시!",
    font: "Giants-Bold",
    fontSize: 48,
    textColor: "white",
    textStrokeColor: "black",
    padding: 8,
  });

  drawBanner(canvas.value, {
    xAlign: "right",
    yAlign: "top",
    x: (canvas.value?.width || 0) - margin,
    y: margin,
    text: "SPOTV NOW",
    font: "Giants-Bold",
    fontSize: 36,
    textColor: "black",
    padding: 8,
    shadow: true,
  });

  // drawGrid(canvas.value);
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
