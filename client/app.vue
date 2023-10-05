<script setup lang="ts">
import { Notify } from "quasar";
import { keySet } from "./composables/constants";

const video = ref();
const file = ref();
const videoOn = ref(false);
const videoPlayOn = ref(true);
const currSpeed = ref(1.5);
const videoSrc = ref("");

const videoProps = useVideoPropsStore();

const upload = (file: any) => {
  const [name, date] = file.name.split("_");
  const code = name + "_" + date;
  const url = URL.createObjectURL(file);

  videoProps.value.videoName = file.name;
  videoProps.value.videoUrl = url;
  videoProps.value.videoCode = code;

  videoSrc.value = url;
  // const backVideo = useBackVideoState();
  // backVideo.value.src = url;
  videoOn.value = true;
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
        pressedKeys.add(event.code);
        handleKeyPress(event, pressedKeys);
      });
      document.addEventListener("keyup", (event) => {
        if (document.activeElement?.tagName === "INPUT") return true;
        pressedKeys.delete(event.code);
      });
      video.value.addEventListener("timeupdate", () => {
        videoProps.value.currentTime = formatTime(video.value?.currentTime);
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

  const teamStore = useTeamStore();

  const playerRow1 = teamStore.value[0];
  const playerRow2 = teamStore.value[1];

  const currCode = event.code;

  const isCommand = (_code: string) =>
    [...pressedKeys].filter((code) => _code === code).length > 0;
  const isCommandS = isCommand("KeyS");
  const isCommandA = isCommand("KeyA");

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
    updateCut(currentCommand, "");
    return;
  }

  if ("skill" === currentCommand && keyIdx1 > -1) {
    updateCut("skill", defaultSkill[keyIdx1].name);
    return;
  }

  if (keyIdx1 > -1) {
    if (!playerRow1.players[keyIdx1]) {
      Notify.create(
        `${playerRow1.name}팀 ${keyIdx1 + 1}번째 선수를 추가해주세요!`
      );
      return;
    }
    updateCut(currentCommand, playerRow1.players[keyIdx1].name);
    return;
  }

  if (keyIdx2 > -1) {
    if (!playerRow2.players[keyIdx2]) {
      Notify.create(
        `${playerRow2.name} 팀 ${keyIdx2 + 1}번째 선수를 추가해주세요!`
      );
      return;
    }
    updateCut(currentCommand, playerRow2.players[keyIdx2].name);
    return;
  }

  if ("KeyC" === currCode) {
    const cutTime = addCut();
    if (cutTime) moveSeekPoint(cutTime);
    return;
  }

  const controlState = useControlState();
  const { fastForwardSec, rewindSec } = controlState.value;

  switch (event.key) {
    case "ArrowLeft":
      video.value.currentTime = Math.max(currentTime - rewindSec, 0);
      break;

    case "ArrowRight":
      if (video.value.paused || video.value.ended || event.ctrlKey) {
        video.value.currentTime = Math.min(
          currentTime + fastForwardSec,
          duration
        );
        return;
      }

      const highSpeed = 8;
      if (video.value.playbackRate !== highSpeed) {
        currSpeed.value = video.value.playbackRate;
        video.value.playbackRate = highSpeed;
        setTimeout(() => {
          video.value.playbackRate = currSpeed.value;
        }, (1000 / 8) * fastForwardSec);
        return;
      }

      video.value.playbackRate = currSpeed.value;

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

const route = useRoute();
</script>
<template>
  <q-layout v-if="route.path === '/'">
    <div style="max-width: 1920px; min-width: 1280px; margin: 0 auto">
      <q-header style="position: relative" class="bg-green" elevated>
        <q-toolbar>
          <q-toolbar-title>MyHighlight 영상편집기</q-toolbar-title>
          <StopWatch />
        </q-toolbar>
      </q-header>
      <q-page-container style="padding: 0">
        <div class="row">
          <div class="col">
            <VideoList />
            <!-- <back-video @moveSeekPoint="moveSeekPoint" /> -->
          </div>
          <div style="width: 960px">
            <div class="column" style="height: 100vh">
              <div style="height: 540px; position: relative" class="column">
                <drag-box :video="video" />
                <video
                  v-show="videoProps.videoUrl"
                  ref="video"
                  width="960"
                  height="540"
                  :src="videoProps.videoUrl"
                  style="position: fixed"
                />
                <ControlBar
                  v-if="videoProps.videoUrl"
                  :video="video"
                  :playOn="videoPlayOn"
                  @togglePlayPause="togglePlayPause()"
                />
              </div>
              <PlayerArea />
            </div>
          </div>
          <div class="col">
            <RecordTable @moveSeekPoint="moveSeekPoint" />
          </div>
        </div>
      </q-page-container>
    </div>
  </q-layout>
  <NuxtPage v-else />
</template>
<style>
body {
  overflow: hidden;
}
</style>
