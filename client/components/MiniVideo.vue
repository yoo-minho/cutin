<script setup lang="ts">
import { getRecordName } from "@/composables/constants";

type Highlight = { videoUrl: string; mainPlayer: string; skill?: string };

const props = defineProps<{
  modelValue: boolean;
  selectedPlayer?: string;
  selectedRecord?: string;
  highlights: Highlight[];
}>();
const emits = defineEmits();

const videoViewerOn = ref(props.modelValue);
watch(
  () => props.modelValue,
  (newValue) => {
    videoViewerOn.value = newValue;
  }
);

watch(
  () => videoViewerOn.value,
  (newValue) => {
    emits("update:modelValue", newValue);
  }
);

const currentSrc = ref("");
const idx = ref(0);

watch(
  () => props.highlights,
  (newHighlights) => {
    idx.value = 0;
    currentSrc.value = newHighlights?.[idx.value].videoUrl;
  }
);

watch(idx, (newIdx) => {
  currentSrc.value = props.highlights?.[newIdx].videoUrl;
});

const prevVideo = () => {
  if (idx.value === 0) {
    idx.value = props.highlights.length - 1;
  } else {
    idx.value -= 1;
  }
};
const nextVideo = () => {
  if (idx.value === props.highlights.length - 1) {
    idx.value = 0;
  } else {
    idx.value += 1;
  }
};

const recordSuffix = () => {
  if (!props.selectedRecord) return "HighLight";
  return props.selectedRecord.length > 0
    ? getRecordName(props.selectedRecord) + " H/L"
    : "HighLight";
};
</script>
<template>
  <q-dialog v-model="videoViewerOn">
    <div class="wrap">
      <q-btn flat v-close-popup round icon="close" class="close-btn" />
      <template v-if="selectedPlayer">
        <div class="banner">
          <div class="title">{{ selectedPlayer }}의 {{ recordSuffix() }}</div>
          <div class="number">(#{{ idx + 1 }}/{{ highlights.length }})</div>
        </div>
      </template>
      <video
        ref="miniVideo"
        class="miniVideo"
        width="960"
        height="540"
        autoplay
        loop
        :src="currentSrc"
      />
      <template v-if="selectedPlayer">
        <div class="bar">
          <div @click="prevVideo()">
            <q-icon name="skip_previous" />
          </div>
          <div @click="nextVideo()">
            <q-icon name="skip_next" />
          </div>
        </div>
      </template>
    </div>
  </q-dialog>
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

/* 모바일 세로방향 화면 (0px ~ 767px) */
@media screen and (max-width: 666px) {
  .banner {
    color: white;
    text-align: center;
    .title {
      font-size: 32px;
      line-height: 32px;
      font-weight: bold;
    }
    .number {
      font-size: 24px;
    }
  }
  .miniVideo {
    width: 100%;
    height: 100%;
  }
  .bar {
    color: white;
    font-size: 36px;
    display: flex;
    justify-content: space-around;
    div {
      cursor: pointer;
    }
  }
  .close-btn {
    cursor: pointer;
    width: 100%;
    color: white;
    font-size: 24px;
    right: 0;
  }
}

/* 모바일 가로방향 화면 (768px ~ 1279px) */
@media screen and (min-width: 667px) and (max-width: 1279px) {
  .banner {
    position: absolute;
    color: white;
    text-align: center;
    width: 100%;
    margin-top: 12px;

    .title {
      font-size: 32px;
      line-height: 32px;
      font-weight: bold;
    }
    .number {
      font-size: 24px;
    }
  }
  .miniVideo {
    width: 100%;
    height: 100vh;
  }
  .bar {
    position: absolute;
    color: white;
    font-size: 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    top: 0;
    height: 100%;
    width: 100%;
    div {
      cursor: pointer;
    }
  }
  .close-btn {
    cursor: pointer;
    position: absolute;
    color: white;
    font-size: 24px;
    right: 0;
    z-index: 1;
  }
}

/* 웹 화면 (1280px 이상) */
@media screen and (min-width: 1280px) {
  .wrap {
    max-width: 1280px !important;
    max-height: 100vh !important;
    overflow: hidden !important;
    position: relative;
  }

  .banner {
    position: absolute;
    color: white;
    text-align: center;
    width: 100%;
    margin-top: 12px;

    .title {
      font-size: 32px;
      line-height: 32px;
      font-weight: bold;
    }
    .number {
      font-size: 24px;
    }
  }
  .miniVideo {
    width: 100%;
    height: 100vh;
  }
  .bar {
    position: absolute;
    color: white;
    font-size: 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    top: 0;
    height: 100%;
    width: 100%;
    div {
      cursor: pointer;
    }
  }
  .close-btn {
    cursor: pointer;
    position: absolute;
    color: white;
    font-size: 24px;
    right: 0;
    z-index: 1;
  }
}
</style>
