<script setup lang="ts">
import { Notify } from "quasar";
import { keySet } from "./composables/constants";

const video = ref();
const file = ref();
const videoOn = ref(false);
const videoPlayOn = ref(true);
const currVideoName = useCurrVideoName();
const playerStoreA = usePlayerStore("A");
const playerStoreB = usePlayerStore("B");
const currTime = ref("");
const currSpeed = ref(1);

const upload = (file: any) => {
  currVideoName.value = file.name;
  videoOn.value = true;
  video.value.src = URL.createObjectURL(file);
};

watch(
  () => video.value,
  () => {
    video.value.addEventListener("loadedmetadata", function () {
      const pressedKeys = new Set<string>();

      playPlayer();
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
    stopPlayer();
    return;
  }

  switch (event.key) {
    case "ArrowLeft":
      video.value.currentTime = Math.max(currentTime - 3, 0);
      break;
    case "ArrowRight":
      if (video.value.paused || video.value.ended) {
        video.value.currentTime = Math.min(currentTime + 3, duration);
        return;
      }

      const highSpeed = 8;
      if (currSpeed.value === highSpeed) return;

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
  <div class="q-pa-none">
    <q-layout
      view="lHh lpr lFf"
      container
      style="max-width: 1920px; min-width: 1280px; min-height: 960px"
      class="shadow-2 rounded-borders"
    >
      <header-bar />
      <div style="margin-top: 68.96px">
        <div class="row">
          <div style="width: 960px">
            <div class="column" style="min-height: calc(960px - 68.96px)">
              <div style="height: 540px; position: relative" class="column">
                <video v-show="videoOn" ref="video" width="960" height="540" />
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
                <player-list teamName="A" />
                <player-list teamName="B" />
                <skill-list />
              </div>
            </div>
          </div>
          <div class="col">
            <record-table :currTime="currTime" @moveSeekPoint="moveSeekPoint" />
          </div>
        </div>
      </div>
    </q-layout>
  </div>
</template>
