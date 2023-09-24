<script setup lang="ts">
import { Dialog } from "quasar";

const props = defineProps<{ video: HTMLVideoElement }>();
const backboardPositionState = useBackboardPositionState();

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

const headerHeight = 68.96;

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
    props.video.addEventListener("mousedown", (e: any) => {
      isDragging = true;
      left.value = e.clientX;
      top.value = e.clientY;
      transform.value = `translate(${e.clientX}px, ${
        e.clientY - headerHeight
      }px)`;
      initSize();
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;

      width.value = e.clientX - left.value;
      height.value = e.clientY - top.value;
    });

    document.addEventListener("mouseup", () => {
      if (!isDragging) return;

      isDragging = false;

      if (width.value < 50 || height.value < 50) {
        console.log(width.value, height.value);
        initSize();
        return;
      }

      Dialog.create({
        title: "분석",
        message: "선택한 영역을 기준으로 변화를 추적할까요?",
        ok: "네!",
        cancel: "취소",
      })
        .onOk(() => {
          const videoBack = useBackVideoState();
          videoBack.value.play();
        })
        .onCancel(() => initSize());
    });
  }
);
</script>
<template>
  <div
    class="box"
    :style="{ transform, width: width + 'px', height: height + 'px' }"
  ></div>
</template>
<style scoped>
.box {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 1;
}
</style>
