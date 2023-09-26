<script setup lang="ts">
import { QTableProps } from "quasar";
import { pixelmatch } from "../utils/pixelmatch";

const props = defineProps<{ currTime: string }>();
const emits = defineEmits<{ (e: "moveSeekPoint", time: string): void }>();

const currTime = toRef(props, "currTime");
const backVideo = useBackVideoState();
const backboardPosition = calculateBackboardPosition();
const backboardTracking = useBackboardTrackingState();

type canvasImage = {
  idx: number;
  canvas: HTMLCanvasElement;
  time: string;
};

const images = [] as canvasImage[];
const speed = 6;
const frame = 0.5; //초당 장수 - 0.5 = 1초당 2장
const frameInterval = (1000 * frame) / speed;

const seekTime = ref("00:00 / 00:00");

const columns = [
  {
    label: "start",
    name: "start",
    field: "start",
    align: "center",
  },
  {
    label: "end",
    name: "end",
    field: "end",
    align: "center",
  },
  {
    label: "duration",
    name: "duration",
    field: "duration",
    align: "center",
  },
] as any;

watch(
  () => backVideo.value,
  () => {
    backVideo.value.addEventListener("loadedmetadata", function () {
      backVideo.value.playbackRate = speed;
      backVideo.value.pause();
      backVideo.value.muted = true;

      backVideo.value.addEventListener("timeupdate", () => {
        const currentTime = backVideo.value.currentTime;
        const duration = backVideo.value.duration;
        seekTime.value = `${formatTime(currentTime)} / ${formatTime(duration)}`;
      });

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

          const time = formatTime(backVideo.value.currentTime);

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

          //그레이스케일
          const grayscaleImageData = context.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
          );
          const contrast = 1;
          const data = grayscaleImageData.data;
          for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = avg * contrast;
            data[i + 1] = avg * contrast;
            data[i + 2] = avg * contrast;
          }
          context.putImageData(grayscaleImageData, 0, 0);

          images.push({ idx, canvas, time });

          if (images.length === 2) {
            const { canvas: canvas1, idx: idx1, time: time1 } = images[0];
            const { canvas: canvas2, idx: idx2, time: time2 } = images[1];
            const similarity = compareImages(canvas1, canvas2);

            if (similarity < 99.9) {
              images.pop();
            } else {
              if (idx1 + 1 < idx2) {
                const trackData = {
                  start: time1,
                  end: time2,
                  duration: (idx2 - idx1) * frame,
                  startIdx: idx1,
                  endIdx: idx2,
                };
                backboardTracking.value.push(trackData);
              }
              images.shift();
            }
          }
          if (backVideo.value.paused || backVideo.value.ended) {
            clearInterval(iv);
            backVideo.value.pause();
          }
        }, frameInterval);
      });
    });
  }
);

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
  <div>
    <div>{{ seekTime }}</div>
    <div class="q-pa-md">
      <q-table
        dark
        flat
        dense
        :columns="columns"
        :rows="backboardTracking"
        :rows-per-page-options="[0]"
      >
        <template #body="props">
          <q-tr
            :props="props"
            :class="props.row.time === currTime ? 'text-green' : ''"
          >
            <q-td key="start" :props="props">
              <div
                class="text-pre-wrap cursor-pointer"
                @click="emits('moveSeekPoint', String(props.row.start))"
              >
                {{ props.row.start }}
              </div>
            </q-td>
            <q-td key="end" :props="props">{{ props.row.end }} </q-td>
            <q-td key="duration" :props="props">{{ props.row.duration }} </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
    <video v-show="false" ref="backVideo" width="960" height="540" />
  </div>
</template>

<style lang="scss" scoped></style>
