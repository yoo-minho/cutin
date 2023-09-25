<script setup lang="ts">
import SpeedSelector from "./SpeedSelector.vue";
const props = defineProps<{ video: HTMLVideoElement; playOn: boolean }>();
const emits = defineEmits<{ (e: "togglePlayPause"): void }>();

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

const boxState = calculateBackboardPosition();
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
        <div style="width: 64px">
          <q-btn
            flat
            color="white"
            :icon="playOn ? 'pause' : 'play_arrow'"
            @click="() => emits('togglePlayPause')"
          />
        </div>
        <div class="text-h5 text-white text-center" style="width: 196px">
          {{ seekTime }}
        </div>
        <div class="col">
          <SpeedSelector :video="video" />
        </div>
        <div class="text-white backboard-info">
          <div>top: {{ boxState.top }}</div>
          <div>left: {{ boxState.left }}</div>
          <div>height: {{ boxState.height }}</div>
          <div>width: {{ boxState.width }}</div>
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
.backboard-info {
  width: 80px;
  font-size: 12px;
  line-height: 12px;
  border: 1px solid white;
  border-radius: 8px;
  padding: 4px 8px;
}
</style>
