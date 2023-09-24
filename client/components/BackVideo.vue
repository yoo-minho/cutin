<script setup lang="ts">
import { pixelmatch } from "../utils/pixelmatch";

const backVideo = useBackVideoState();
const backboardPosition = calculateBackboardPosition();
const backboardTracking = useBackboardTrackingState();

type canvasImage = {
  idx: number;
  canvas: HTMLCanvasElement;
};

const images = [] as canvasImage[];
const speed = 16;
const frame = 0.5; //초당 장수 - 0.5 = 1초당 2장
const frameInterval = (1000 * frame) / speed;

watch(
  () => backVideo.value,
  () => {
    backVideo.value.addEventListener("loadedmetadata", function () {
      backVideo.value.playbackRate = speed;
      backVideo.value.pause();
      backVideo.value.muted = true;
      backVideo.value.addEventListener("play", function () {
        let idx = 0;

        const {
          top: cropY,
          left: cropX,
          width: cropWidth,
          height: cropHeight,
        } = backboardPosition.value;

        const iv = setInterval(() => {
          idx++;
          const canvas = document.createElement("canvas");
          canvas.width = backVideo.value.videoWidth;
          canvas.height = backVideo.value.videoHeight;
          const context = canvas.getContext("2d");
          context?.drawImage(
            backVideo.value,
            0,
            0,
            canvas.width,
            canvas.height
          );

          if (!context) return;

          //crop
          const croppedImageData = context.getImageData(
            cropX,
            cropY,
            cropWidth,
            cropHeight
          );
          canvas.width = cropWidth;
          canvas.height = cropHeight;
          context.putImageData(croppedImageData, 0, 0);

          //grayscale
          const grayscaleImageData = context.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
          );
          const grayscaleData = grayscaleImageData.data;
          for (let i = 0; i < grayscaleData.length; i += 4) {
            const avg =
              (grayscaleData[i] + grayscaleData[i + 1] + grayscaleData[i + 2]) /
              3;
            grayscaleData[i] = avg;
            grayscaleData[i + 1] = avg;
            grayscaleData[i + 2] = avg;
          }
          context.putImageData(grayscaleImageData, 0, 0);

          images.push({ idx, canvas });

          if (images.length === 2) {
            const { canvas: canvas1, idx: idx1 } = images[0];
            const { canvas: canvas2, idx: idx2 } = images[1];
            const similarity = compareImages(canvas1, canvas2);
            console.log({ idx1, idx2, similarity });

            if (similarity < 99.9 && similarity > 50) {
              console.log("다운로드");
              downloadImage(canvas2.toDataURL("image/jpeg"), idx2);
              images.pop();
            } else {
              if (idx1 + 1 < idx2) {
                const trackData = {
                  start: sec2str(idx1 * frame),
                  end: sec2str(idx2 * frame),
                  startIdx: idx1,
                  endIdx: idx2,
                };
                backboardTracking.value.push(trackData);
              }
              images.shift();
            }
          }
          if (idx > 100) {
            clearInterval(iv);
            backVideo.value.pause();
            backVideo.value.currentTime = 0;
          }
        }, frameInterval);
      });
    });
  }
);

function sec2str(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
}

function downloadImage(dataUrl: string, idx: number) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = `frame${idx}.jpg`; // 다운로드 파일 이름
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function compareImages(canvas1: HTMLCanvasElement, canvas2: HTMLCanvasElement) {
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
    }
  );
  const totalPixels = canvas1.width * canvas1.height;
  return ((totalPixels - mismatchedPixels) / totalPixels) * 100;
}
</script>
<template>
  <video v-show="false" ref="backVideo" width="960" height="540" />
</template>

<style lang="scss" scoped></style>
