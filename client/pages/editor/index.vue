<script setup lang="ts">
const video = ref();
const videoPlayOn = ref(true);
const currSpeed = ref(1.5);
const videoProps = useVideoPropsStore();
const innerHeight = ref("100vh");

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

  innerHeight.value = `${window.innerHeight}px`;
  window.addEventListener("resize", () => {
    innerHeight.value = `${window.innerHeight}px`;
  });
  videoProps.value.videoEl = video.value;
});

watch(video, () => {
  video.value.addEventListener("loadedmetadata", function () {
    video.value.playbackRate = currSpeed.value;
    playPlayer();
    setTimeout(() => stopPlayer(), 1);
  });
});

function moveSeekPoint(time: string) {
  video.value.currentTime = time2sec(time);
  stopPlayer();
}

async function handleKeyPress(event: any, pressedKeys: any) {
  const isCommand = (_code: string) =>
    [...pressedKeys].filter((code) => _code === code).length > 0;

  const isCommandS = isCommand("KeyS");
  const isCommandA = isCommand("KeyA");
  const isCommandC = "KeyC" === event.code;
  const isCommandSpace = " " === event.key;
  const keyIdx1 = keySet.first.indexOf(event.key);
  const keyIdx2 = keySet.second.indexOf(event.key?.toUpperCase());
  const isCommand123890 = keyIdx1 > -1;
  const isCommanQWEIOP = keyIdx2 > -1;
  const isCommandArrow = event.key.indexOf("Arrow") === 0;

  if (
    isCommandS ||
    isCommandA ||
    isCommandC ||
    isCommandSpace ||
    isCommandArrow ||
    isCommand123890 ||
    isCommanQWEIOP
  ) {
    event.preventDefault();

    const teamStore = await useTeamStore(videoProps.value.videoName);
    const row1 = teamStore.value[0]?.players || [];
    const row2 = teamStore.value[1]?.players || [];

    if (isCommandC) {
      const cutTime = await addCut();
      if (cutTime) moveSeekPoint(cutTime);
      return;
    }
    if (isCommandA && isCommandSpace) return updateCut("subPlayer", "");
    if (isCommandS && isCommandSpace) return updateCut("skill", "");
    if (isCommandS && (isCommand123890 || isCommanQWEIOP)) {
      const skillName = (i: number) => defaultSkill[i].name || "득점&어시";
      if (isCommand123890) return updateCut("skill", skillName(keyIdx1));
      if (isCommanQWEIOP) return updateCut("skill", skillName(keyIdx2 + 10));
    }
    if (isCommand123890 || isCommanQWEIOP) {
      const type = isCommandA ? "subPlayer" : "mainPlayer";
      if (row1[keyIdx1 + 1]) return updateCut(type, row1[keyIdx1 + 1].name);
      if (row2[keyIdx2 + 1]) return updateCut(type, row2[keyIdx2 + 1].name);
    }
    if (isCommandSpace) return togglePlayPause();
    if (isCommandArrow) return handleArrowKeyPress(event);
  }
}

async function handleArrowKeyPress(event: any) {
  const currentTime = video.value.currentTime;
  const duration = video.value.duration;
  const controlState = useControlState();
  const { fastForwardSec, rewindSec } = controlState.value;

  const moveNextTime = async (n: 1 | 0 | -1) => (await moveNextCut(n)).seekTime;

  switch (event.key) {
    case "ArrowUp":
      video.value.currentTime = time2sec(await moveNextTime(-1));
      break;

    case "ArrowDown":
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
      width: 100vw;
    "
    :style="{ height: innerHeight }"
  >
    <div
      style="
        max-width: 1920px;
        min-width: 1280px;
        display: flex;
        flex-direction: column;
        box-shadow: 10px 10px 20px #888888;
        border-radius: 20px;
        overflow: hidden;
      "
      :style="{ height: innerHeight }"
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
            cutin video editor 🏀
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
                tabindex="-1"
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

<style lang="scss" scoped>
:focus-visible {
  outline: 0;
}
</style>
