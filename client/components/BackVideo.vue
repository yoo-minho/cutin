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
  canvas: HTMLCanvasElement;
  time: string;
  sim: number;
};

const images = ref<canvasImage[]>([]);
const speed = 6;

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
    const zoom = 4;
    backVideo.value.addEventListener("loadedmetadata", () => {
      backVideo.value.playbackRate = speed;
      backVideo.value.pause();
      backVideo.value.muted = true;

      const catchFrame = () => {
        const currentTime = backVideo.value.currentTime;
        const currentFormatTime = formatTime(currentTime);
        const duration = backVideo.value.duration;
        seekTime.value = `${formatTime(currentTime)} / ${formatTime(duration)}`;
        let {
          top: cropY,
          left: cropX,
          width: cropWidth,
          height: cropHeight,
        } = backboardPosition.value;
        cropY = cropY / zoom;
        cropX = cropX / zoom;
        cropWidth = cropWidth / zoom;
        cropHeight = cropHeight / zoom;

        const canvas = document.createElement("canvas");
        canvas.width = backVideo.value.videoWidth;
        canvas.height = backVideo.value.videoHeight;
        const context = canvas.getContext("2d");
        context?.drawImage(
          backVideo.value,
          0,
          0,
          canvas.width / zoom,
          canvas.height / zoom
        );

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
        if (images.value.length > 0) {
          const sim = compareImages(
            canvas,
            images.value[images.value.length - 1].canvas
          );
          images.value.push({ canvas, time: currentFormatTime, sim });
        } else {
          images.value.push({ canvas, time: currentFormatTime, sim: 0 });
        }

        if (backVideo.value.paused || backVideo.value.ended) {
          backVideo.value.pause();
        } else {
          requestAnimationFrame(catchFrame);
        }
      };

      backVideo.value.addEventListener("play", function () {
        requestAnimationFrame(catchFrame);
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
      threshold: 0.2,
    }
  );
  const totalPixels = canvas1.width * canvas1.height;
  return +(((totalPixels - mismatchedPixels) / totalPixels) * 100).toFixed(2);
}
</script>
<template>
  <div>
    <div>{{ seekTime }} {{ backVideo?.playbackRate }}</div>
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
      <div class="row" style="overflow-y: scroll; height: calc(100vh - 200px)">
        <div v-for="img in images.filter((img) => img.sim < 99 && img.sim > 0)">
          <img width="50" :src="img.canvas.toDataURL('image/jpeg')" />
          {{ img.time }} - {{ img.sim }}
        </div>
      </div>
    </div>
    <video v-show="false" ref="backVideo" width="960" height="540" />
  </div>
</template>

<style lang="scss" scoped></style>
