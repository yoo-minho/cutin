<script setup lang="ts">
import { pixelmatch } from "../utils/pixelmatch";

const props = defineProps<{ src: Ref<string> }>();
const src = toRef(props, "src");

const videoBack = ref();

type canvasImage = {
  idx: number;
  canvas: HTMLCanvasElement;
};

const images = [] as canvasImage[];

onMounted(() => {
  videoBack.value.src = src.value;
});

watch(
  () => videoBack.value,
  () => {
    videoBack.value.addEventListener("loadedmetadata", function () {
      const speed = 16;
      videoBack.value.playbackRate = speed;
      const frameInterval = 500 / speed;

      videoBack.value.play();

      videoBack.value.addEventListener("play", function () {
        let idx = 0;
        const iv = setInterval(function () {
          const canvas = document.createElement("canvas");
          canvas.width = videoBack.value.videoWidth;
          canvas.height = videoBack.value.videoHeight;
          const context = canvas.getContext("2d");
          context?.drawImage(
            videoBack.value,
            0,
            0,
            canvas.width,
            canvas.height
          );
          const cropX = 874; // 시작 x 좌표
          const cropY = 342; // 시작 y 좌표
          const cropWidth = 226; // 가로 크기
          const cropHeight = 170; // 세로 크기
          if (!context) return;

          const croppedImageData = context.getImageData(
            cropX,
            cropY,
            cropWidth,
            cropHeight
          );
          canvas.width = cropWidth;
          canvas.height = cropHeight;
          context.putImageData(croppedImageData, 0, 0);
          images.push({ idx, canvas });

          if (images.length === 2) {
            const canvas1 = images[0].canvas;
            const canvas2 = images[1].canvas;
            const imageData1 = canvas1
              .getContext("2d")
              ?.getImageData(0, 0, canvas1.width, canvas1.height);
            const imageData2 = canvas2
              .getContext("2d")
              ?.getImageData(0, 0, canvas2.width, canvas2.height);
            const diffImageData = new ImageData(canvas1.width, canvas1.height);

            const mismatchedPixels = pixelmatch(
              imageData1?.data,
              imageData2?.data,
              diffImageData.data,
              canvas1.width,
              canvas1.height,
              {
                threshold: 0.2, // 임계값을 조정할 수 있습니다.
                diffColor: [255, 0, 0], // 다른 픽셀 색상
                diffColorAlt: [255, 0, 0], // 다른 픽셀 색상과 동일한 색상으로 설정
              }
            );
            const totalPixels = canvas1.width * canvas1.height;
            const similarity =
              ((totalPixels - mismatchedPixels) / totalPixels) * 100;
            if (similarity < 99.9) {
              console.log(
                images[0].idx,
                images[1].idx,
                "체킹",
                secondsToMinutesAndSeconds(images[0].idx * 0.5)
              );
            }
            images.shift();
          }
          if (idx > 200) {
            clearInterval(iv);
          }
          idx++;
        }, frameInterval);
      });
    });
  }
);

function secondsToMinutesAndSeconds(seconds: number) {
  // 전체 초 값을 분과 초로 분리합니다.
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // 분과 초를 "00분 00초" 형식으로 포맷팅합니다.
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}분 ${formattedSeconds}초`;
}

function downloadImage(dataUrl: string, idx: number) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = `frame${idx}.jpg`; // 다운로드 파일 이름
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
</script>
<template>
  <video v-show="false" ref="videoBack" width="960" height="540" :src="src" />
</template>

<style lang="scss" scoped></style>
