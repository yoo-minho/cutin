<script setup lang="ts">
import SpeedSelector from "./SpeedSelector.vue";
const props = defineProps<{ video: HTMLVideoElement; playOn: boolean }>();
const emits = defineEmits<{ togglePlayPause: () => void }>();

const seekTime = ref("");
const seekProgress = ref(0);

props.video.addEventListener("timeupdate", () => {
  const currentTime = props.video.currentTime;
  const duration = props.video.duration;
  seekTime.value = `${formatTime(currentTime)} / ${formatTime(duration)}`;
  seekProgress.value = (currentTime / duration) * 100;
});

const seek = (x: any) => {
  props.video.currentTime = (x / 100) * props.video.duration;
};
</script>
<template>
  <div class="control-bar">
    <div class="q-ma-md">
      <q-slider
        v-model="seekProgress"
        color="white"
        :min="0"
        :max="100"
        :step="(3 / video.duration) * 100"
        thumb-size="12px"
        @update:model-value="seek"
      />
      <div class="row items-center">
        <div class="col">
          <q-btn
            flat
            color="white"
            :icon="playOn ? 'pause' : 'play_arrow'"
            @click="() => emits('togglePlayPause')"
          />
        </div>
        <div class="col-3 text-h5 text-white">
          {{ seekTime }}
        </div>
        <div class="col-8">
          <SpeedSelector :video="video" />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.control-bar {
  width: 100%;
  position: absolute;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5));
}
</style>
