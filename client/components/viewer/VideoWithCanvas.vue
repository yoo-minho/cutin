<script setup lang="ts">
import type { CutType } from "@/types";

const props = defineProps<{
  cut: CutType;
  widthLimit?: boolean;
  routine?: boolean;
}>();
const emits = defineEmits<{
  (e: "loadedVideoUrl", elem: HTMLVideoElement): void;
  (e: "endedVideoUrl", elem: HTMLVideoElement): void;
}>();

const video = ref<HTMLVideoElement>();
const canvas = ref<HTMLCanvasElement>();
const loadingScreen = ref(true);

const loadedVideoUrl = () => {
  loadingScreen.value = true;
  if (video.value) {
    emits("loadedVideoUrl", video.value);
  }
};

const loadReplaceUrl = () => {
  loadingScreen.value = false;
  // if (video.value) {
  //   if (video.value.src.indexOf("https://cutin.cc") === 0) return;
  //   const newUrl = video.value.src.replace(
  //     "http://localhost:3000/",
  //     "https://cutin.cc/"
  //   );
  //   video.value.src = newUrl;
  // }
};

const loadVideoCallback = () => {
  if (video.value && video.value?.duration < 1) {
    loadReplaceUrl();
    return;
  }

  loadingScreen.value = false;
  let tick = 0;
  let goal = false;
  const _vsScore = { ...props.cut.vsScore };

  const playListener = () => {
    const convertCut = { ...props.cut };
    const { subPlayer, team = "team", skill, vsScore } = convertCut;
    vsScore[team] = _vsScore[team];
    const { main } = getSkillPoints(skill);

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
      if (currentSec > shortsSeekSec) tick++;
      if (currentSec > shortsSeekSec && !goal) {
        vsScore[team] = _vsScore[team] + (main.pts || 0);
        goal = true;
      }

      drawVideoBanners(canvasEl, convertCut, tick);
      requestAnimationFrame(renderFrame);
    };
    renderFrame();
  };
  video.value?.addEventListener("play", playListener);
  video.value?.addEventListener("ended", () => {
    tick = 0;
    goal = false;
    if (video.value) {
      emits("endedVideoUrl", video.value);
      if (props.routine) video.value.play();
    }
  });
  video.value?.play();
};
</script>
<template>
  <div style="max-width: 100%; position: relative">
    <video
      v-if="cut.videoUrl"
      ref="video"
      class="miniVideo"
      :class="{ 'max-width': widthLimit }"
      width="960"
      height="540"
      tabindex="-1"
      autoplay
      webkit-playsinline
      playsinline
      controlslist="nodownload"
      :src="cut.videoUrl"
      @loadstart="loadedVideoUrl"
      @loadeddata="loadVideoCallback"
      @error="loadReplaceUrl"
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
