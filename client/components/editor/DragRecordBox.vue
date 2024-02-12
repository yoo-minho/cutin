<script setup lang="ts">
import { Dialog } from "quasar";

const props = defineProps<{ video?: HTMLVideoElement; videoName: string }>();

const transform = ref("");
const top = ref(0);
const left = ref(0);
const width = ref(0);
const height = ref(0);

let isDragging = false;

const initSize = () => {
  width.value = 0;
  height.value = 0;
};

let backboardPositionState: any;

watch(
  () => props.videoName,
  () => {
    backboardPositionState = useBackboardPositionState(props.videoName);
  }
);

watch([top, left, width, height], () => {
  backboardPositionState.value = {
    top: top.value,
    left: left.value,
    width: width.value,
    height: height.value,
  };
});

watch(
  () => props.video,
  () => {
    if (!props.video) return;

    props.video.addEventListener("mousedown", (e: any) => {
      if (!props.video) return;
      isDragging = true;

      left.value = e.clientX - props.video.offsetLeft;
      top.value = e.clientY - props.video.offsetTop;
      transform.value = `translate(${left.value}px, ${top.value}px)`;

      initSize();
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      if (!props.video) return;
      width.value = e.clientX - left.value - props.video.offsetLeft;
      height.value = width.value * 0.5625;
    });

    document.addEventListener("mouseup", () => {
      if (!isDragging) return;

      isDragging = false;

      if (width.value < 25 || height.value < 25) {
        initSize();
        return;
      }

      Dialog.create({
        title: "영역 지정",
        message: "선택한 영역을 기준으로 영상 편집할까요?",
        ok: "네!",
        cancel: "취소",
      })
        .onOk(() => {})
        .onCancel(() => initSize());
    });
  },
  { immediate: true }
);
</script>
<template>
  <div class="box" :style="{ transform, width: width + 'px', height: height + 'px' }"></div>
</template>
<style scoped>
.box {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 1;
  top: 0;
  left: 0;
}
</style>
