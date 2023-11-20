<script setup lang="ts">
const props = defineProps<{ videoUrlArr: string[] }>();
const miniVideo = ref();
const idx = ref(0);

onMounted(() => {
  watch(
    idx,
    () => {
      miniVideo.value.src = props.videoUrlArr[idx.value];
    },
    { immediate: true }
  );
});

const prevVideo = () => {
  idx.value -= 1;
};

const nextVideo = () => {
  idx.value += 1;
};
</script>
<template>
  <div class="wrap">
    <div class="shorts_banner">
      {{ videoUrlArr.length }}개 중 {{ idx + 1 }}번째 하이라이트
    </div>
    <video
      ref="miniVideo"
      class="miniVideo"
      width="960"
      height="540"
      autoplay
      loop
    />
    <div class="landscape">
      <div v-if="idx > 0" class="prev_button" @click="prevVideo()">이전</div>
      <div
        v-if="idx < videoUrlArr.length - 1"
        class="next_button"
        @click="nextVideo()"
      >
        다음
      </div>
    </div>
    <div class="portrait row justify-center" style="gap: 16px">
      <div v-if="idx > 0" class="shorts_banner" @click="prevVideo()">이전</div>
      <div
        v-if="idx < videoUrlArr.length - 1"
        class="shorts_banner"
        @click="nextVideo()"
      >
        다음
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.q-dialog__inner--minimized {
  padding: 0;
}

.wrap {
  max-width: 100vw !important;
  max-height: 100vh !important;
  overflow: hidden !important;
  position: relative;
}

/* CSS에서 미디어 쿼리 사용 */
@media only screen and (max-width: 767px) {
  .miniVideo {
    width: 100%;
    height: 100%;
  }
  .shorts_banner {
    font-size: 24px;
    color: white;
    text-align: center;
  }
  .landscape {
    display: none;
  }
}

@media only screen and (min-width: 768px) {
  .miniVideo {
    width: 100%;
    height: 100vh;
  }
  .shorts_banner {
    font-size: 4em;
    font-weight: bold;
    color: white;
    margin: 1rem;
    text-align: center;
    position: absolute;
    top: 0;
    right: 0;
  }
  .prev_button {
    cursor: pointer;
    font-size: 2em;
    font-weight: bold;
    color: white;
    position: fixed;
    top: 50vh;
    left: 1em;
  }
  .next_button {
    cursor: pointer;
    font-size: 2em;
    font-weight: bold;
    color: white;
    position: fixed;
    top: 50vh;
    right: 1em;
  }
  .portrait {
    display: none;
  }
}
</style>
