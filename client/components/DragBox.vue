<script setup lang="ts">
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
      transform.value = `translate(${e.clientX}px, ${e.clientY}px)`;
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
