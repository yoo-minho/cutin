<script setup lang="ts">
import type { CutType } from "@/types";

const props = defineProps<{
  cut?: CutType;
  widthLimit?: boolean;
  routine?: boolean;
}>();
const emits = defineEmits<{
  (e: "loadedVideoUrl", elem?: HTMLVideoElement): void;
  (e: "endedVideoUrl", elem?: HTMLVideoElement): void;
}>();

const video = ref<HTMLVideoElement>();
const canvas = ref<HTMLCanvasElement>();
const loadingScreen = ref(true);
const tick = ref(0);
const goal = ref(false);

const videoUrl = ref(props.cut?.videoUrl);
watch(
  () => props.cut?.videoUrl,
  (url) => (videoUrl.value = url)
);

onMounted(() => {
  loadedVideoUrl();
  video.value?.addEventListener("play", playListener);
  video.value?.addEventListener("pause", () => {
    tick.value = 0;
    goal.value = false;
    emits("endedVideoUrl", video.value);
    if (video.value) {
      if (props.routine) video.value.play();
    }
  });
});

const loadedVideoUrl = () => {
  loadingScreen.value = true;
  emits("loadedVideoUrl", video.value);
};

const playListener = () => {
  const _vsScore = { ...props.cut?.vsScore };
  const convertCut = JSON.parse(JSON.stringify(props.cut));
  const { subPlayer, team = "team", skill, vsScore } = convertCut;
  vsScore[team] = _vsScore[team];

  const videoEl = video.value;
  const canvasEl = canvas.value;

  const renderFrame = () => {
    if (!videoEl || videoEl.paused || videoEl.ended || !canvasEl) {
      return;
    }

    const canvasCtx = canvasEl.getContext("2d");
    if (canvasCtx) {
      canvasCtx.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height);
    }

    const currentSec = videoEl.currentTime;
    const shortsSeekSec = findShortsSeekSec(skill, subPlayer);
    if (currentSec > shortsSeekSec) tick.value++;
    if (currentSec > shortsSeekSec && !goal.value) {
      const { main } = getSkillPoints(skill);
      vsScore[team] = _vsScore[team] + (main.pts || 0);
      goal.value = true;
    }

    drawVideoBanners(canvasEl, convertCut, tick.value);
    requestAnimationFrame(renderFrame);
  };
  renderFrame();
};

const loadVideoCallback = () => {
  loadingScreen.value = false;
  tick.value = 0;
  goal.value = false;
  video.value?.play();
};
</script>
<template>
  <div style="max-width: 100%; position: relative; aspect-ratio: 16/9">
    <video
      ref="video"
      class="miniVideo"
      :class="{ 'max-width': widthLimit }"
      width="960"
      height="540"
      tabindex="-1"
      autoplay
      muted
      webkit-playsinline
      playsinline
      controlslist="nodownload"
      :src="videoUrl"
      @loadstart="loadedVideoUrl"
      @loadedmetadata="loadVideoCallback"
    />
    <canvas
      ref="canvas"
      width="960"
      height="540"
      class="miniVideo"
      :class="{ 'max-width': widthLimit }"
      style="position: absolute; overflow: hidden; left: 0; z-index: 1"
    ></canvas>
    <div
      style="
        position: absolute;
        z-index: 1;
        top: 0;
        display: flex;
        width: 100%;
        height: 100%;
        justify-content: space-around;
        align-items: center;
      "
    >
      <q-inner-loading :showing="loadingScreen" style="aspect-ratio: 16/9">
        <q-spinner size="80px" />
      </q-inner-loading>
      <slot name="buttons" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.miniVideo {
  aspect-ratio: 16/9;
  height: auto;
  overflow: hidden;
}
</style>
