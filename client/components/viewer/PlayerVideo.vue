<script setup lang="ts">
import type { CutType, PlayerStatType } from "@/types";
import VideoWithCanvas from "./VideoWithCanvas.vue";

const props = defineProps<{
  modelValue: boolean;
  selectedPlayer?: string;
  selectedPlayerStat?: PlayerStatType;
  selectedRecord?: string;
  cuts: CutType[];
}>();
const emits = defineEmits();

const currentCuts = ref(props.cuts);
const idx = ref(0);
const videoViewerOn = ref(props.modelValue);
const recordFilterModel = ref();

watch(
  () => props.modelValue,
  (newValue) => (videoViewerOn.value = newValue)
);
watch(videoViewerOn, (newValue) => emits("update:modelValue", newValue));

const options = () => getPlayerOption(props.selectedPlayerStat);
const beforeShow = () => {
  recordFilterModel.value = options()[0];
  currentCuts.value = props.cuts;
};

watch(recordFilterModel, (newVal) => {
  if (newVal?.value === "") {
    currentCuts.value = props.cuts;
    return;
  }
  currentCuts.value = props.cuts.filter((hl) => {
    const _skill = hl.skill || "";
    const areYouMainPlayer = hl.mainPlayer === props.selectedPlayer;
    if (newVal?.value === "ast") return !areYouMainPlayer;
    return areYouMainPlayer && isSkillOk(_skill, newVal?.value || "");
  });
});

watch(currentCuts, (newVal) => {
  if (newVal?.length > 0) {
    idx.value = 0;
  }
});

const prevVideo = () => {
  if (idx.value === 0) {
    idx.value = currentCuts.value.length - 1;
  } else {
    idx.value -= 1;
  }
};
const nextVideo = () => {
  if (idx.value === currentCuts.value.length - 1) {
    idx.value = 0;
  } else {
    idx.value += 1;
  }
};
</script>
<template>
  <q-dialog
    v-model="videoViewerOn"
    class="mini-video"
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
      <VideoWithCanvas
        :cut="currentCuts[idx]"
        :width-limit="true"
        :routine="true"
      >
        <template #buttons>
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
        </template>
      </VideoWithCanvas>
      <div v-if="currentCuts.length > 1" class="row">
        <div
          v-for="index in currentCuts.length"
          style="height: 3px; flex: 1; margin: 1px; border-radius: 4px"
          :style="{
            'background-color': idx + 1 === index ? 'orange' : 'white',
          }"
        ></div>
      </div>
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
            v-model="recordFilterModel"
            :options="options()"
            label="기록 필터"
          />
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<style lang="scss" scoped>
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
</style>
