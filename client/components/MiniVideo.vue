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
  selectedPlayerStat?: PlayerStat;
  selectedRecord?: string;
  highlights: Highlight[];
}>();
const emits = defineEmits();

const miniVideo = ref<HTMLVideoElement>();
const miniCanvas = ref<HTMLCanvasElement>();
const loadingScreen = ref(false);

const options = () => [
  { label: "전체", value: "" },
  ...[
    ,
    { label: "득점", value: "pts" },
    { label: "리바", value: "reb" },
    { label: "어시", value: "ast" },
    { label: "3점", value: "tpm" },
    { label: "공리", value: "orb" },
    { label: "스틸", value: "stl" },
    { label: "블락", value: "blk" },
  ].filter(
    (o) =>
      o && props.selectedPlayerStat && props.selectedPlayerStat[o.value] > 0
  ),
];
const model = ref(options()[0]);
const idx = ref(0);
const currentSrc = ref("");
const currentHighlights = ref(props.highlights);

const beforeShow = () => {
  model.value = options()[0];
  idx.value = 0;
  currentHighlights.value = props.highlights;
  currentSrc.value = currentHighlights.value?.[idx.value]?.videoUrl;
};

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

const drawMiddleCanvas = () => {
  if (!(miniCanvas.value && miniVideo.value)) return;
  const ctx = miniCanvas.value.getContext("2d");
  if (!ctx) return;
  ctx.drawImage(
    miniVideo.value,
    0,
    0,
    miniCanvas.value.width,
    miniCanvas.value.height
  );
};

watch(model, (newVal) => {
  if (newVal?.value === "") {
    currentHighlights.value = props.highlights;
    return;
  }
  const filteredHighlights = props.highlights.filter((hl) => {
    const _skill = hl.skill || "";
    const areYouMainPlayer = hl.mainPlayer === props.selectedPlayer;
    if (newVal?.value === "ast") return !areYouMainPlayer;
    return isSkillOk(_skill, newVal?.value || "");
  });
  currentHighlights.value = filteredHighlights;
});

watch(
  currentHighlights,
  (newVal) => {
    if (newVal?.length > 0) {
      idx.value = 0;
      drawMiddleCanvas();
      const newVideoUrl = newVal?.[idx.value].videoUrl;
      if (currentSrc.value !== newVideoUrl) {
        loadingScreen.value = true;
      }
      currentSrc.value = newVideoUrl;
    }
  },
  { immediate: true }
);

watch(idx, () => {
  drawMiddleCanvas();
  const newVideoUrl = currentHighlights.value?.[idx.value].videoUrl;
  if (currentSrc.value !== newVideoUrl) {
    loadingScreen.value = true;
  }
  currentSrc.value = newVideoUrl;
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
  <q-dialog
    v-model="videoViewerOn"
    class="mini-video max-width"
    position="bottom"
    @before-show="beforeShow()"
  >
    <div class="wrap">
      <q-header bordered class="max-width" style="position: relative">
        <q-toolbar>
          <q-btn
            dense
            icon="keyboard_arrow_down"
            @click="videoViewerOn = false"
          />
          <q-toolbar-title>Highlight</q-toolbar-title>
          <q-btn
            side
            icon="aspect_ratio"
            flat
            dense
            @click="Notify.create('가로보기 기능 준비중!')"
          />
          <q-btn
            side
            flat
            dense
            icon="download"
            @click="Notify.create('다운로드 기능 준비중!')"
          />
        </q-toolbar>
      </q-header>
      <div>
        <div class="bar max-width">
          <q-btn
            text-color="white"
            icon="skip_previous"
            flat
            round
            @click="prevVideo()"
          />
          <q-btn
            text-color="white"
            icon="skip_next"
            flat
            round
            @click="nextVideo()"
          />
        </div>
        <div
          class="max-width"
          style="position: absolute"
          :style="{ 'z-index': loadingScreen ? 0 : -1 }"
        >
          <q-inner-loading
            :showing="true"
            class="max-width"
            style="aspect-ratio: 16/9"
          >
            <q-spinner size="80px" />
          </q-inner-loading>
          <canvas
            ref="miniCanvas"
            width="960"
            height="540"
            class="miniVideo max-width"
          ></canvas>
        </div>
        <div>
          <video
            ref="miniVideo"
            class="miniVideo max-width"
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
      <div class="row">
        <div
          v-for="index in currentHighlights.length"
          style="height: 3px; flex: 1; margin: 1px; border-radius: 4px"
          :style="{
            'background-color': idx + 1 === index ? 'orange' : 'white',
          }"
        ></div>
      </div>
      <template v-if="selectedPlayer">
        <div class="banner-wrap">
          <div class="banner">
            <div class="title">{{ selectedPlayer }}</div>
            <div v-if="selectedPlayerStat" class="number">
              {{ getTitleWithStat(selectedPlayerStat) }}
            </div>
          </div>
          <div>
            <q-select
              class="select"
              label-color="white"
              bg-color="orange-5"
              standout
              stack-label
              v-model="model"
              :options="options()"
              label="기록 필터"
            />
          </div>
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

  .wrap {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: black;

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
  // @media screen and (max-width: 666px) {
  .miniVideo {
    aspect-ratio: 16/9;
    height: auto;
    overflow: hidden;
  }
  .banner-wrap {
    display: flex;

    & > div {
      flex: 1;
    }

    .select {
      margin: 12px;
    }

    .banner {
      color: white;
      margin: 16px;
      .title {
        font-size: 28px;
        line-height: 28px;
        font-weight: bold;
      }
      .number {
        font-size: 16px;
        color: #ccc;
      }
    }
  }

  .bar {
    position: absolute;
    opacity: 0.8;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 1;
    position: absolute;
    width: 100%;
    aspect-ratio: 16/9;
    button {
      cursor: pointer;
      font-size: 24px;
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
  // }

  // /* 모바일 가로방향 화면 (768px ~ 1279px) */
  // @media screen and (min-width: 667px) and (max-width: 1279px) {
  //   .banner {
  //     position: absolute;
  //     color: white;
  //     text-align: center;
  //     width: 100%;
  //     margin-top: 12px;

  //     .title {
  //       font-size: 32px;
  //       line-height: 32px;
  //       font-weight: bold;
  //     }
  //     .number {
  //       font-size: 24px;
  //     }
  //   }

  //   .bar {
  //     position: absolute;
  //     display: flex;
  //     justify-content: space-between;
  //     align-items: center;
  //     top: 0;
  //     height: 100%;
  //     width: 100%;
  //     button {
  //       opacity: 0.5;
  //       color: white;
  //       font-size: 24px;
  //       cursor: pointer;
  //     }
  //   }
  //   .top-btns {
  //     position: absolute;
  //     display: flex;
  //     justify-content: center;
  //     z-index: 1;
  //     right: 0;
  //     button {
  //       color: white;
  //       font-size: 24px;
  //     }
  //   }
  // }

  // /* 웹 화면 (1280px 이상) */
  // @media screen and (min-width: 1280px) {
  //   .wrap {
  //     max-width: 1280px !important;
  //     max-height: 100vh !important;
  //     overflow: hidden !important;
  //     position: relative;
  //   }

  //   .banner {
  //     position: absolute;
  //     color: white;
  //     text-align: center;
  //     width: 100%;
  //     margin-top: 12px;

  //     .title {
  //       font-size: 32px;
  //       line-height: 32px;
  //       font-weight: bold;
  //     }
  //     .number {
  //       font-size: 24px;
  //     }
  //   }
  //   .bar {
  //     position: absolute;
  //     display: flex;
  //     justify-content: space-between;
  //     align-items: center;
  //     top: 0;
  //     height: 100%;
  //     width: 100%;
  //     button {
  //       opacity: 0.5;
  //       color: white;
  //       font-size: 24px;
  //       cursor: pointer;
  //     }
  //   }
  //   .top-btns {
  //     display: flex;
  //     position: absolute;
  //     top: 0;
  //     right: 0;

  //     z-index: 1;

  //     button {
  //       color: white;
  //       font-size: 32px;
  //     }
  //   }
  // }
}
</style>
