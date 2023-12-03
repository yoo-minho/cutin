<script setup lang="ts">
import { Notify } from "quasar";

const video = ref();
const videoPlayOn = ref(true);
const currSpeed = ref(1.5);
const videoProps = useVideoPropsStore();

onMounted(() => {
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
});

watch(
  () => video.value,
  () => {
    video.value.addEventListener("loadedmetadata", function () {
      video.value.playbackRate = currSpeed.value;
      playPlayer();
      setTimeout(() => stopPlayer(), 1);
    });
  }
);

function moveSeekPoint(time: string) {
  video.value.currentTime = time2sec(time);
  stopPlayer();
}

async function handleKeyPress(event: any, pressedKeys: any) {
  event.preventDefault();

  const videoProps = useVideoPropsStore();
  const teamStore = await useTeamStore(videoProps.value.videoName);

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
    ? "subPlayer"
    : isCommandS
    ? "skill"
    : "mainPlayer";

  if (["subPlayer", "skill"].includes(currentCommand) && event.key === " ") {
    updateCut(currentCommand, "");
    return;
  }

  if ("skill" === currentCommand) {
    if (keyIdx1 > -1) {
      const name = defaultSkill[keyIdx1].name;
      if (name) updateCut("skill", name);
      return;
    }
    if (keyIdx2 > -1) {
      const name = defaultSkill[keyIdx2 + 10].name;
      if (name) updateCut("skill", name);
      return;
    }
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
    const cutTime = await addCut();
    if (cutTime) moveSeekPoint(cutTime);
    return;
  }

  const controlState = useControlState();
  const { fastForwardSec, rewindSec } = controlState.value;

  const moveNextTime = async (n: 1 | 0 | -1) => (await moveNextCut(n)).seekTime;

  switch (event.key) {
    case "ArrowUp":
      video.value.currentTime = time2sec(await moveNextTime(-1));
      break;

    case "ArrowDown":
      //다음시간대로
      video.value.currentTime = time2sec(await moveNextTime(1));
      break;

    case "ArrowLeft":
      if ((video.value.paused || video.value.ended) && event.ctrlKey) {
        await updateCut("seekTime", formatTime(video.value.currentTime - 1));
        video.value.currentTime = video.value.currentTime - 1;
        return;
      }
      video.value.currentTime = Math.max(currentTime - rewindSec, 0);
      break;

    case "ArrowRight":
      if ((video.value.paused || video.value.ended) && event.ctrlKey) {
        await updateCut("seekTime", formatTime(video.value.currentTime + 1));
        video.value.currentTime = video.value.currentTime + 1;
        return;
      }

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
</script>
<template>
  <div
    style="
      display: flex;
      justify-content: center;
      background: #ddd;
      align-items: center;
      height: 100vh;
      width: 100vw;
    "
  >
    <div
      style="
        max-width: 1920px;
        min-width: 1280px;
        max-height: 1080px;
        min-height: 720px;
        display: flex;
        flex-direction: column;
        box-shadow: 10px 10px 20px #888888;
        border-radius: 20px;
      "
    >
      <div
        style="
          position: relative;
          border-top-left-radius: 20px;
          border-top-right-radius: 20px;
          color: white;
        "
        class="bg-orange-5"
        elevated
      >
        <q-toolbar>
          <q-toolbar-title
            style="font-size: 24px; letter-spacing: -1px; font-weight: bold"
          >
            cutin video editor
          </q-toolbar-title>
          <StopWatch />
        </q-toolbar>
      </div>
      <div style="padding: 0; flex: 1" class="row">
        <div class="column col">
          <div style="height: 540px">
            <VideoList />
          </div>
          <q-separator color="grey-7" size="1px" />
          <div class="col">
            <SkillList style="border-bottom-left-radius: 20px" />
          </div>
          <!-- <back-video @moveSeekPoint="moveSeekPoint" /> -->
        </div>
        <div style="width: 960px">
          <div
            class="column"
            style="
              height: 100vh;
              max-height: calc(1080px - 50px);
              min-height: calc(720px - 50px);
            "
          >
            <div style="height: 540px; position: relative" class="column">
              <drag-box :video="video" />
              <video
                id="baseVideo"
                v-show="videoProps.videoUrl"
                ref="video"
                width="960"
                height="540"
                :src="videoProps.videoUrl"
                style="position: fixed"
              />
              <canvas id="baseCanvas" style="width: 960px; height: 540px" />
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
        <div class="col" style="border-bottom-right-radius: 20px">
          <RecordTable @moveSeekPoint="moveSeekPoint" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
