<script setup lang="ts">
type Highlight = { videoUrl: string; mainPlayer: string; skill?: string };

const props = defineProps<{
  highlights: Highlight[];
}>();
const miniVideo = ref();
const idx = ref(0);

onMounted(() => {
  watch(
    idx,
    () => {
      miniVideo.value.src = props.highlights[idx.value].videoUrl;
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
    <div class="shorts_banner font1">
      {{ highlights.length }}개 중 {{ idx + 1 }}번째 하이라이트
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
      <div class="prev_button font1" @click="prevVideo()">
        <q-icon v-if="idx > 0" name="skip_previous" />
      </div>
      <div class="next_button font1" @click="nextVideo()">
        <q-icon v-if="idx < highlights.length - 1" name="skip_next" />
      </div>
    </div>
    <div class="portrait row justify-center" style="gap: 16px">
      <div class="shorts_banner font1" @click="prevVideo()">
        <q-icon v-if="idx > 0" name="skip_previous" />
      </div>
      <div class="shorts_banner font1" @click="nextVideo()">
        <q-icon v-if="idx < highlights.length - 1" name="skip_next" />
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
  .portrait {
  }
  .landscape {
    display: none;
  }
  .miniVideo {
    width: 100%;
    height: 100%;
  }
  .shorts_banner {
    font-size: 24px;
    color: white;
    text-align: center;
  }
}

@media only screen and (min-width: 768px) {
  .font1 {
    font-size: 36px;
    margin: 16px;
    line-height: 36px;
    text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.7);
  }
  .shorts_banner {
    position: absolute;
    color: white;
    font-weight: bold;
    top: 0;
    right: 0;
  }
  .landscape {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .prev_button {
      cursor: pointer;
      font-weight: bold;
      color: white;
      left: 1em;
    }
    .next_button {
      cursor: pointer;
      font-weight: bold;
      color: white;
      right: 1em;
    }
  }
  .miniVideo {
    width: 100%;
    height: 100vh;
  }
  .portrait {
    display: none;
  }
}
</style>
