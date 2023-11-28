<script setup lang="ts">
type Highlight = { videoUrl: string; mainPlayer: string; skill?: string };
type PlayerStat = {
  tpm: number;
  ast: number;
  reb: number;
  orb: number;
  blk: number;
  stl: number;
  [x: string]: number;
};

const props = defineProps<{
  modelValue: boolean;
  selectedPlayer?: string;
  selectedPlayerStat?: any;
  selectedRecord?: string;
  highlights: Highlight[];
}>();
const emits = defineEmits();

const miniVideo = ref<HTMLVideoElement>();
const miniCanvas = ref<HTMLCanvasElement>();
const loadingScreen = ref(false);

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

const drawMiddleCanvas = () => {
  if (!(miniCanvas.value && miniVideo.value)) return;
  const ctx = miniCanvas.value.getContext("2d");
  if (!ctx) return;
  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    "로딩중...",
    miniCanvas.value.width / 2,
    miniCanvas.value.height / 2
  );
  ctx.drawImage(
    miniVideo.value,
    0,
    0,
    miniCanvas.value.width,
    miniCanvas.value.height
  );
};

watch(
  () => props.highlights,
  (newHighlights) => {
    if (newHighlights?.length > 0) {
      idx.value = 0;
      drawMiddleCanvas();
      loadingScreen.value = true;
      currentSrc.value = newHighlights?.[idx.value]?.videoUrl;
    }
  },
  { immediate: true }
);

watch(idx, (newIdx) => {
  drawMiddleCanvas();
  loadingScreen.value = true;
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

const loadVideoCallback = () => {
  loadingScreen.value = false;
  if (miniVideo.value) {
    // miniVideo.value.playbackRate = 1 / 2.5;
  }
};

const getTitleWithStat = (selectedPlayerStat: PlayerStat) => {
  const getContents = (statName: string) => {
    if (statName === "pts") return "득점";
    if (statName === "ast") return "어시";
    if (statName === "reb") return "리바";
    if (statName === "stl") return "스틸";
    if (statName === "blk") return "블락";
    return "";
  };
  const x = Object.keys(selectedPlayerStat)
    .filter((k) => ["ast", "reb", "blk", "stl"].includes(k))
    .map((k) => ({ name: k, val: selectedPlayerStat[k] }))
    .filter((v) => v.val > 2)
    .sort((a, b) => b.val - a.val);
  const subStat = x.map((v) => v.val + getContents(v.name)).join(" ");
  if (selectedPlayerStat.pts > 0) {
    return selectedPlayerStat.pts + "득점 " + subStat;
  } else {
    return subStat;
  }
};
</script>
<template>
  <q-dialog v-model="videoViewerOn" class="mini-video" persistent>
    <div class="wrap">
      <div class="top-btns">
        <q-btn flat v-close-popup round icon="close" class="close" />
      </div>
      <template v-if="selectedPlayer">
        <div class="banner">
          <div class="title">{{ selectedPlayer }}</div>
          <div class="number">
            {{ getTitleWithStat(selectedPlayerStat) }}
          </div>
        </div>
        <div class="row">
          <div
            v-for="index in highlights.length"
            style="height: 3px; flex: 1; margin: 1px; border-radius: 4px"
            :style="{
              'background-color': idx + 1 === index ? 'orange' : 'white',
            }"
          ></div>
        </div>
      </template>
      <div>
        <div v-show="loadingScreen">
          <canvas
            ref="miniCanvas"
            width="960"
            height="540"
            class="miniVideo"
          ></canvas>
        </div>
        <div v-show="!loadingScreen">
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
            @loadeddata="loadVideoCallback"
          />
        </div>
      </div>
      <template v-if="selectedPlayer">
        <div class="bar">
          <q-btn
            push
            round
            color="white"
            text-color="primary"
            icon="skip_previous"
            @click="prevVideo()"
          />
          <q-btn
            push
            round
            color="white"
            text-color="primary"
            icon="skip_next"
            @click="nextVideo()"
          />
        </div>
      </template>
    </div>
  </q-dialog>
</template>

<style lang="scss">
.mini-video {
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

    .video-loading {
      width: 100vw;
      aspect-ratio: 16 / 9;
      overflow: hidden;
      color: white;
      background: $orange-5;
      display: flex;
      justify-content: center;
      align-items: center;
      position: static;
      font-size: 24px;
    }
  }

  /* 모바일 세로방향 화면 (0px ~ 767px) */
  @media screen and (max-width: 666px) {
    .miniVideo {
      width: 100vw;
      aspect-ratio: 16/9;
      height: auto;
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
        font-size: 16px;
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

    .bar {
      position: absolute;
      display: flex;
      justify-content: space-between;
      align-items: center;
      top: 0;
      height: 100%;
      width: 100%;
      button {
        opacity: 0.5;
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
    .bar {
      position: absolute;
      display: flex;
      justify-content: space-between;
      align-items: center;
      top: 0;
      height: 100%;
      width: 100%;
      button {
        opacity: 0.5;
        color: white;
        font-size: 24px;
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
}
</style>
