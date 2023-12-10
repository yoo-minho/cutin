<script setup lang="ts">
import type { CutType } from "@/types";
import VideoWithCanvas from "./VideoWithCanvas.vue";

const props = defineProps<{ modelValue: boolean; cut: CutType }>();
const emits = defineEmits();

const videoViewerOn = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newValue) => (videoViewerOn.value = newValue)
);
watch(videoViewerOn, (newValue) => emits("update:modelValue", newValue));
</script>
<template>
  <q-dialog v-model="videoViewerOn" class="mini-video">
    <VideoWithCanvas :cut="cut" />
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
