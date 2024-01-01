<script setup lang="ts">
import type { CutType } from "@/types";
import VideoWithCanvas from "./VideoWithCanvas.vue";

const props = defineProps<{ modelValue: boolean; cuts: CutType[] }>();
const emits = defineEmits();

const videoViewerOn = ref(props.modelValue);
const video = ref<HTMLVideoElement>();
const idx = ref(0);

watch(
  () => props.modelValue,
  (newValue) => (videoViewerOn.value = newValue)
);
watch(videoViewerOn, (newValue) => emits("update:modelValue", newValue));

const loadedVideoElem = (elem: HTMLVideoElement) => {
  video.value = elem;
  video.value.autoplay = false;
};

const endedVideoElem = (elem: HTMLVideoElement) => {
  idx.value++;
};
</script>
<template>
  <q-dialog v-model="videoViewerOn" class="mini-video">
    <VideoWithCanvas
      :cut="cuts[idx]"
      @loaded-video-url="loadedVideoElem"
      @ended-video-url="endedVideoElem"
    />
  </q-dialog>
</template>

<style lang="scss">
.mini-video {
  .q-dialog__inner--minimized {
    padding: 0;
  }

  .miniVideo {
    aspect-ratio: 16/9;
    height: auto;
    overflow: hidden;
  }
}
</style>
