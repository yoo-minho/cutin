<script setup lang="ts">
import { getSyncTime } from "@/composables/videoState";

const controlState = useControlState();
const videoStore = useVideoStore();

const video = ref();
const file = ref();
const uploader = ref();
const videoUrl = ref("");
const videoPlayOn = ref(false);

const playPlayer = () => {
  video.value.play();
  videoPlayOn.value = true;
};

const stopPlayer = () => {
  video.value.pause();
  videoPlayOn.value = false;
};

const togglePlayer = () => {
  if (video.value.paused || video.value.ended) return playPlayer();
  return stopPlayer();
};

const movePlayer = (time: string) => {
  video.value.currentTime = time2sec(time);
  stopPlayer();
};

const uploadVideo = (e: any) => uploader.value.pickFiles(e);

const KeyPressArrow = async (event: any) => {
  const currentTime = video.value.currentTime;
  const duration = video.value.duration;

  const { fastForwardSec, rewindSec } = controlState.value;
  switch (event.key) {
    case "ArrowUp":
    case "ArrowDown":
      break;

    case "ArrowLeft":
      if ((video.value.paused || video.value.ended) && event.ctrlKey) {
        await updateCut("seekTime", formatTime(video.value.currentTime - 1));
        video.value.currentTime = video.value.currentTime - 1;
        return;
      }
      video.value.currentTime = Math.max(currentTime - rewindSec, 0);
      break;

    case "ArrowRight":
      if ((video.value.paused || video.value.ended) && event.ctrlKey) {
        await updateCut("seekTime", formatTime(video.value.currentTime + 1));
        video.value.currentTime = video.value.currentTime + 1;
        return;
      }

      if (video.value.paused || video.value.ended || event.ctrlKey) {
        video.value.currentTime = Math.min(
          currentTime + fastForwardSec,
          duration
        );
        return;
      }

      const highSpeed = 8;
      if (video.value.playbackRate !== highSpeed) {
        videoStore.value.currSpeed = video.value.playbackRate;
        video.value.playbackRate = highSpeed;
        setTimeout(() => {
          video.value.playbackRate = videoStore.value.currSpeed;
        }, (1000 / 8) * fastForwardSec);
        return;
      }

      video.value.playbackRate = videoStore.value.currSpeed;
      break;
    default:
      break;
  }
};

const submitVideo = async (f: File) => {
  videoUrl.value = URL.createObjectURL(f);
  video.value.addEventListener("loadedmetadata", () => {
    videoStore.value.videoElems.push({
      video,
      videoName: f.name,
      togglePlayer,
      movePlayer,
      KeyPressArrow,
    });
    video.value.playbackRate = videoStore.value.currSpeed;
    // playPlayer();
  });

  video.value.addEventListener("timeupdate", () => {
    videoStore.value.syncTime = getSyncTime();
  });
};
</script>
<template>
  <ControlBar
    v-if="video"
    :video="video"
    :playOn="videoPlayOn"
    style="z-index: 1"
    @togglePlayPause="togglePlayer()"
  />
  <div class="column videoLayer">
    <q-btn
      color="orange-7"
      text-color="white"
      icon-right="file_download"
      style="position: absolute"
      @click="uploadVideo"
    >
      영상 업로드
      <q-file
        ref="uploader"
        v-model="file"
        :multiple="false"
        borderless
        dense
        @update:model-value="submitVideo"
        style="display: none"
      />
    </q-btn>
    <drag-box :video="video" />
    <video
      v-show="videoUrl"
      ref="video"
      width="960"
      height="540"
      tabindex="-1"
      :src="videoUrl"
      style="position: fixed"
    />
    <canvas style="width: 960px; height: 540px" />
  </div>
</template>

<style lang="scss" scoped>
:focus-visible {
  outline: 0;
}
.videoLayer {
  border-left: 1px solid $orange-7;
  border-right: 1px solid $orange-7;
  height: 540px;
  position: relative;
  background: #777;
  align-items: center;
  justify-content: center;
}
</style>
