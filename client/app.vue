<script setup lang="ts">
import { Notify } from "quasar";
import { keySet } from "./composables/constants";

const video = ref();
const file = ref();
const videoOn = ref(false);
const videoPlayOn = ref(true);
const currVideoName = useCurrVideoName();
const currTime = ref("");
const currSpeed = ref(1.5);
const videoSrc = ref("");

const upload = (file: any) => {
  currVideoName.value = file.name;
  videoOn.value = true;
  const url = URL.createObjectURL(file);
  videoSrc.value = url;
  const backVideo = useBackVideoState();
  backVideo.value.src = url;
};

watch(
  () => video.value,
  () => {
    video.value.addEventListener("loadedmetadata", function () {
      video.value.playbackRate = currSpeed.value;
      playPlayer();
      setTimeout(() => stopPlayer(), 1);

      const pressedKeys = new Set<string>();
      document.addEventListener("keydown", (event) => {
        if (document.activeElement?.tagName === "INPUT") return true;
        pressedKeys.add(event.key);
        handleKeyPress(event, pressedKeys);
      });
      document.addEventListener("keyup", (event) => {
        if (document.activeElement?.tagName === "INPUT") return true;
        pressedKeys.delete(event.key);
      });
      video.value.addEventListener("timeupdate", () => {
        currTime.value = formatTime(video.value?.currentTime);
      });
    });
  }
);

function moveSeekPoint(time: string) {
  video.value.currentTime = time2sec(time);
  stopPlayer();
}

function handleKeyPress(event: any, pressedKeys: any) {
  event.preventDefault();
  if (video.value === null) return;

  const playerStoreA = usePlayerStore("A");
  const playerStoreB = usePlayerStore("B");

  const isCommandS =
    [...pressedKeys].filter((key) => key?.toUpperCase() === "S").length > 0;
  const isCommandA =
    [...pressedKeys].filter((key) => key?.toUpperCase() === "A").length > 0;

  const keyIdx1 = keySet.first.indexOf(event.key);
  const keyIdx2 = keySet.second.indexOf(event.key?.toUpperCase());

  const currentTime = video.value.currentTime;
  const duration = video.value.duration;

  const currentCommand = isCommandA
    ? "assister"
    : isCommandS
    ? "skill"
    : "scorer";

  if (["assister", "skill"].includes(currentCommand) && event.key === " ") {
    updateCut(currentCommand, currTime.value, "");
    return;
  }

  if ("skill" === currentCommand && keyIdx1 > -1) {
    updateCut("skill", currTime.value, defaultSkill[keyIdx1].name);
    return;
  }

  if (keyIdx1 > -1) {
    if (!playerStoreA.value[keyIdx1]) {
      Notify.create(`A팀 ${keyIdx1 + 1}번째 선수를 추가해주세요!`);
      return;
    }
    updateCut(currentCommand, currTime.value, playerStoreA.value[keyIdx1].name);
    return;
  }

  if (keyIdx2 > -1) {
    if (!playerStoreB.value[keyIdx2]) {
      Notify.create(`B팀 ${keyIdx2 + 1}번째 선수를 추가해주세요!`);
      return;
    }
    updateCut(currentCommand, currTime.value, playerStoreB.value[keyIdx2].name);
    return;
  }

  if ("C" === event.key.toUpperCase()) {
    addCut(currTime.value);
    moveSeekPoint(currTime.value);
    return;
  }

  switch (event.key) {
    case "ArrowLeft":
      video.value.currentTime = Math.max(currentTime - 3, 0);
      break;
    case "ArrowRight":
      if (video.value.paused || video.value.ended || event.ctrlKey) {
        video.value.currentTime = Math.min(currentTime + 10, duration);
        return;
      }

      const highSpeed = 8;
      if (video.value.playbackRate === highSpeed) {
        video.value.playbackRate = currSpeed.value;
        return;
      }

      currSpeed.value = video.value.playbackRate;
      video.value.playbackRate = highSpeed;
      setTimeout(() => {
        video.value.playbackRate = currSpeed.value;
      }, 500);
      break;
    case " ":
      togglePlayPause();
      break;
    default:
      break;
  }
}

function playPlayer() {
  video.value.play();
  videoPlayOn.value = true;
}

function stopPlayer() {
  video.value.pause();
  videoPlayOn.value = false;
}

function togglePlayPause() {
  if (video.value.paused || video.value.ended) {
    playPlayer();
  } else {
    stopPlayer();
  }
}
</script>
<template>
  <q-layout>
    <div style="max-width: 1920px; min-width: 1280px; margin: 0 auto">
      <q-header style="position: relative" class="bg-green" elevated>
        <q-toolbar>
          <q-toolbar-title>Short-cut</q-toolbar-title>
        </q-toolbar>
      </q-header>
      <q-page-container style="padding: 0">
        <div class="row">
          <div class="col">
            <div
              class="bg-dark text-white"
              style="height: 100%; border-right: 0.5px solid grey"
            >
              <back-video :currTime="currTime" @moveSeekPoint="moveSeekPoint" />
            </div>
          </div>
          <div style="width: 960px">
            <div class="column" style="height: 100vh">
              <div style="height: 540px; position: relative" class="column">
                <drag-box :video="video" />
                <video
                  v-show="videoOn"
                  ref="video"
                  width="960"
                  height="540"
                  :src="videoSrc"
                  style="position: fixed"
                />
                <control-bar
                  v-if="videoOn"
                  :video="video"
                  :playOn="videoPlayOn"
                  @togglePlayPause="togglePlayPause()"
                />
                <q-file
                  v-else
                  v-model="file"
                  borderless
                  prefix="Upload"
                  @update:model-value="upload"
                >
                  <template #before>
                    <q-icon name="upload" size="lg" />
                  </template>
                </q-file>
              </div>
              <div class="col bg-dark q-pa-md">
                <template v-if="videoOn">
                  <player-list teamName="A" />
                  <player-list teamName="B" />
                </template>
                <template v-else>
                  <div class="text-white q-mb-md">비디오를 업로드해주세요!</div>
                </template>
                <skill-list />
              </div>
            </div>
          </div>
          <div class="col">
            <record-table :currTime="currTime" @moveSeekPoint="moveSeekPoint" />
          </div>
        </div>
      </q-page-container>
    </div>
  </q-layout>
</template>
<style>
body {
  overflow: hidden;
}
</style>
