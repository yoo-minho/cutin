<script setup lang="ts">
import type { CutType } from "@/types";
import VideoWithCanvas from "./VideoWithCanvas.vue";

const props = defineProps<{ modelValue: boolean; cuts: CutType[] }>();
const emits = defineEmits();

const videoViewerOn = ref(props.modelValue);
const video = ref<HTMLVideoElement>();
const idx = ref(0);
const quater = ref(1);

watch(
  () => props.modelValue,
  (newValue) => {
    idx.value = 0;
    videoViewerOn.value = newValue;
  }
);
watch(videoViewerOn, (newValue) => emits("update:modelValue", newValue));

watch(idx, () => {
  quater.value = props.cuts[idx.value].quaterNo;
});

const loadedVideoElem = (elem: HTMLVideoElement) => {
  video.value = elem;
  video.value.autoplay = false;
  video.value.playbackRate = 1;
};

const endedVideoElem = (elem: HTMLVideoElement) => {
  idx.value++;
};
</script>
<template>
  <q-dialog v-model="videoViewerOn" class="mini-video" position="bottom">
    <div class="wrap">
      <q-header bordered class="max-width" style="position: relative">
        <q-toolbar>
          <q-btn
            dense
            icon="keyboard_arrow_down"
            @click="videoViewerOn = false"
          />
          <q-toolbar-title>
            모든 영상 [#{{ idx + 1 }}/{{ cuts.length }}]
          </q-toolbar-title>
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
        :cut="cuts[idx]"
        :width-limit="true"
        @loaded-video-url="loadedVideoElem"
        @ended-video-url="endedVideoElem"
      />
      <div class="row">
        <div
          v-for="index in cuts.length"
          style="height: 3px"
          :style="{
            flex: idx + 1 === index ? '12px' : '1',
            'background-color': idx + 1 === index ? 'orange' : 'white',
          }"
        ></div>
      </div>
      <div style="flex: 3; overflow-y: scroll; overflow-x: hidden">
        <div class="text-orange-5 text-center text-h6">{{ quater }}쿼터</div>
        <template v-for="(cut, i) in cuts">
          <ViewerItemBroadcastLine
            v-if="cut.quaterNo === 1 && quater === 1"
            :cut="cut"
            :class="{ 'text-orange': idx === i }"
          />
          <ViewerItemBroadcastLine
            v-if="cut.quaterNo === 2 && quater === 2"
            :cut="cut"
            :class="{ 'text-orange': idx === i }"
          />
          <ViewerItemBroadcastLine
            v-if="cut.quaterNo === 3 && quater === 3"
            :cut="cut"
            :class="{ 'text-orange': idx === i }"
          />
          <ViewerItemBroadcastLine
            v-if="cut.quaterNo === 4 && quater === 4"
            :cut="cut"
            :class="{ 'text-orange': idx === i }"
          />
        </template>
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
