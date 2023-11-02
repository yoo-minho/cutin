<script setup lang="ts">
const canvas = ref<HTMLCanvasElement>();

onMounted(async () => {
  const font = "NEXON Lv1 Gothic OTF";
  const fontURL =
    "url(https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2307-1@1.1/Giants-Bold.woff2)";

  const customFont = new FontFace(font, fontURL);
  const fontObj = await customFont.load();
  document.fonts.add(fontObj);

  const renderFrame = () => {
    const canvasContext = canvas.value?.getContext("2d");
    if (!canvasContext) return;
    canvasContext.font = `1px ${font}`; // 원하는 폰트 및 크기로 설정

    const margin = 32;
    const { top, right } = drawBanner(canvas.value, {
      x: margin,
      y: (canvas.value?.height || 0) - margin,
      text: "화이트     41",
      font,
      fontSize: 32,
      textColor: "black",
      bgColor: "white",
      padding: 8,
    });

    const { right: right2 } = drawBanner(canvas.value, {
      x: right,
      y: (canvas.value?.height || 0) - margin,
      text: "1Q",
      font,
      fontSize: 32,
      textColor: "white",
      bgColor: "grey",
      padding: 8,
    });

    const { right: right3 } = drawBanner(canvas.value, {
      x: right2,
      y: (canvas.value?.height || 0) - margin,
      text: "23    블랙",
      font,
      fontSize: 32,
      textColor: "black",
      bgColor: "white",
      padding: 8,
    });

    drawBanner(canvas.value, {
      x: right3,
      y: (canvas.value?.height || 0) - margin,
      text: "09:10",
      font,
      fontSize: 32,
      textColor: "white",
      bgColor: "black",
      padding: 8,
    });

    drawBanner(canvas.value, {
      x: margin,
      y: top,
      text: "🏀 2023-10-24(토) GBA 동아리 농구경기",
      font,
      fontSize: 16,
      textColor: "white",
      bgColor: "yellowgreen",
      padding: 8,
    });

    drawBanner(canvas.value, {
      xAlign: "right",
      x: (canvas.value?.width || 0) - margin,
      y: (canvas.value?.height || 0) - margin,
      text: "유민호의 Three Pointer!",
      font,
      fontSize: 48,
      textColor: "white",
      textStrokeColor: "black",
      letterWidthRatio: 0.95,
      padding: 8,
    });

    const { right: right4 } = drawBanner(canvas.value, {
      yAlign: "top",
      x: margin,
      y: margin,
      text: "농구잘해",
      font,
      fontSize: 48,
      textColor: "black",
      textStrokeColor: "orange",

      padding: 8,
      shadow: true,
    });

    // drawGrid(canvas.value);
    // requestAnimationFrame(renderFrame);
  };
  renderFrame();
});
</script>
<template>
  <canvas id="baseCanvas" width="1280" height="720" ref="canvas"></canvas>
</template>

<style lang="scss" scoped>
#baseCanvas {
  width: 960px;
  height: 540px;
  background-color: chartreuse;
}
</style>
