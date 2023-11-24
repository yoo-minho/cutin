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
  },
  { immediate: true }
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

const orientationType = ref(String(window.screen.orientation.type));
const rotateScreen = async () => {
  try {
    if (window.screen && window.screen.orientation) {
      if (window.screen.orientation.type.includes("portrait")) {
        await window.screen.orientation.lock("landscape");
        orientationType.value = "landscape";
      } else if (window.screen.orientation.type.includes("landscape")) {
        window.screen.orientation.unlock();
        orientationType.value = "landscaportraitpe";
      }
    }
  } catch (e) {
    console.error("이 기능은 지원되지 않습니다.");
  }
};
</script>
<template>
  <q-dialog v-model="videoViewerOn">
    <div class="wrap">
      <div class="top-btns">
        <q-btn
          flat
          round
          :icon="`stay_current_${
            orientationType === 'portrait' ? 'landscape' : 'portrait'
          }`"
          class="landscape"
          @click="rotateScreen()"
        />
        <q-btn flat v-close-popup round icon="close" class="close" />
      </div>
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
        play
        loop
        tabindex="-1"
        webkit-playsinline
        playsinline
        controlslist="nodownload"
        :src="currentSrc"
      />
      <template v-if="selectedPlayer">
        <div class="bar">
          <q-btn icon="skip_previous" round @click="prevVideo()" />
          <q-btn icon="skip_next" @click="nextVideo()" />
        </div>
      </template>
    </div>
  </q-dialog>
</template>

<style lang="scss">
.q-dialog__inner--minimized {
  padding: 0;
}

.q-dialog__backdrop {
  background-color: #010101;
}

.wrap {
  max-width: 100vw !important;
  max-height: 100vh !important;
  overflow: hidden !important;
  position: relative;
}

/* 모바일 세로방향 화면 (0px ~ 767px) */
@media screen and (max-width: 666px) {
  .miniVideo {
    width: 100%;
    height: 100%;
  }
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
  .bar {
    display: flex;
    justify-content: space-around;
    z-index: 1;
    button {
      color: white;
      font-size: 24px;
      cursor: pointer;
    }
  }
  .top-btns {
    display: flex;
    justify-content: center;
    z-index: 1;
    button {
      color: white;
      font-size: 24px;
    }
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
    display: flex;
    justify-content: space-between;
    align-items: center;
    top: 0;
    height: 100%;
    width: 100%;
    button {
      color: white;
      font-size: 24px;
      cursor: pointer;
    }
  }
  .top-btns {
    position: absolute;
    display: flex;
    justify-content: center;
    z-index: 1;
    right: 0;
    button {
      color: white;
      font-size: 24px;
    }
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
  .top-btns {
    display: flex;
    position: absolute;
    top: 0;
    right: 0;

    z-index: 1;

    button {
      color: white;
      font-size: 32px;
    }
  }
}
</style>
