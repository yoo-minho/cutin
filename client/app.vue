<script setup lang="ts">
const video = ref();
const file = ref();
const seekProgress = ref(0);
const seekTime = ref("");
const videoOn = ref(false);
const videoPlayOn = ref(true);

const upload = (file: any) => {
  videoOn.value = true;
  video.value.src = URL.createObjectURL(file);
};

const seek = (x: any) => {
  video.value.currentTime = (x / 100) * video.value.duration;
  video.value.focus();
};

const updateSeekBar = () => {
  const currentTime = video.value.currentTime;
  const duration = video.value.duration;
  seekProgress.value = (currentTime / duration) * 100;
  seekTime.value = `${formatTime(currentTime)} / ${formatTime(duration)}`;
};

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

watch(
  () => video.value,
  () => {
    video.value.addEventListener("timeupdate", updateSeekBar);
    video.value.addEventListener("loadedmetadata", function () {
      playOn();
      document.addEventListener("keydown", handleKeyPress);
    });
  }
);

function handleKeyPress(event: any) {
  event.preventDefault();
  if (video.value === null) return;
  const currentTime = video.value.currentTime;
  const duration = video.value.duration;
  switch (event.key) {
    case "ArrowLeft":
      video.value.currentTime = Math.max(currentTime - 3, 0);
      break;
    case "ArrowRight":
      video.value.currentTime = Math.min(currentTime + 3, duration);
      break;
    case " ":
      togglePlayPause();
      break;
    case "c":
      // store.push({ time: video.currentTime });
      // document.getElementById("store").innerText = JSON.stringify(store);
      break;
    default:
      break;
  }
}

function playOn() {
  video.value.play();
  videoPlayOn.value = true;
}

function togglePlayPause() {
  if (video.value.paused || video.value.ended) {
    playOn();
  } else {
    video.value.pause();
    videoPlayOn.value = false;
  }
}
</script>

<template>
  <div class="q-pa-md">
    <q-layout
      view="lHh lpr lFf"
      container
      style="max-width: 1920px; min-width: 1280px; min-height: 960px"
      class="shadow-2 rounded-borders"
    >
      <q-header elevated>
        <q-bar class="bg-black text-white">
          <q-icon name="laptop_chromebook" />
          <q-space />

          <q-btn dense flat icon="minimize" />
          <q-btn dense flat icon="crop_square" />
          <q-btn dense flat icon="close" />
        </q-bar>

        <div class="bg-dark text-white q-pa-sm q-pl-md row items-center">
          <div class="cursor-pointer non-selectable">
            File
            <q-menu>
              <q-list dense style="min-width: 100px">
                <q-item clickable v-close-popup>
                  <q-item-section>Open...</q-item-section>
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section>New</q-item-section>
                </q-item>

                <q-separator />

                <q-item clickable>
                  <q-item-section>Preferences</q-item-section>
                  <q-item-section side>
                    <q-icon name="keyboard_arrow_right" />
                  </q-item-section>

                  <q-menu anchor="top end" self="top start">
                    <q-list>
                      <q-item v-for="n in 3" :key="n" dense clickable>
                        <q-item-section>Submenu Label</q-item-section>
                        <q-item-section side>
                          <q-icon name="keyboard_arrow_right" />
                        </q-item-section>
                        <q-menu auto-close anchor="top end" self="top start">
                          <q-list>
                            <q-item v-for="n in 3" :key="n" dense clickable>
                              <q-item-section>3rd level Label</q-item-section>
                            </q-item>
                          </q-list>
                        </q-menu>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-item>

                <q-separator />

                <q-item clickable v-close-popup>
                  <q-item-section>Quit</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </div>
        </div>
      </q-header>

      <div style="margin-top: 68.96px">
        <div class="row">
          <div style="width: 960px">
            <div class="column" style="min-height: calc(960px - 68.96px)">
              <div style="height: 540px; position: relative" class="column">
                <video ref="video" width="960" height="540"></video>
                <template v-if="videoOn">
                  <div
                    style="
                      width: 100%;
                      position: absolute;
                      bottom: 0;
                      background: linear-gradient(
                        to bottom,
                        rgba(0, 0, 0, 0),
                        rgba(0, 0, 0, 0.5)
                      );
                    "
                  >
                    <div class="q-ma-md">
                      <q-slider
                        v-model="seekProgress"
                        color="white"
                        :min="0"
                        :max="100"
                        :step="(3 / video.duration) * 100"
                        thumb-size="12px"
                        @update:model-value="seek"
                      />
                      <div class="row">
                        <div class="col-1">
                          <q-btn
                            flat
                            color="white"
                            :icon="videoPlayOn ? 'play_arrow' : 'pause'"
                          />
                        </div>
                        <div class="text-h5 text-white">
                          {{ seekTime }}
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <q-file
                    v-model="file"
                    borderless
                    prefix="Upload"
                    @update:model-value="upload"
                  >
                    <template v-slot:before>
                      <q-icon name="upload" size="lg" />
                    </template>
                  </q-file>
                </template>
              </div>
              <div class="col" style="background-color: aquamarine">.col-4</div>
            </div>
          </div>
          <div class="col" style="background-color: bisque">.col</div>
        </div>
      </div>
    </q-layout>
  </div>
</template>
