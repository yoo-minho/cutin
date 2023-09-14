<script setup lang="ts">
const video = ref();
const file = ref();
const seekProgress = ref(0);
const seekTime = ref("");
const upload = (file: any) => {
  video.value.src = URL.createObjectURL(file);
  video.value.play();
};
const updateSeekBar = () => {
  const currentTime = video.value.currentTime;
  const duration = video.value.duration;
  seekProgress.value = currentTime / duration;
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
    console.log("wat");
    video.value.addEventListener("timeupdate", updateSeekBar);
  }
);
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
        <q-bar>
          <q-icon name="laptop_chromebook" />
          <div>Google Chrome</div>

          <q-space />

          <q-btn dense flat icon="minimize" />
          <q-btn dense flat icon="crop_square" />
          <q-btn dense flat icon="close" />
        </q-bar>

        <div class="q-pa-sm q-pl-md row items-center">
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

          <div class="q-ml-md cursor-pointer non-selectable">
            Edit
            <q-menu auto-close>
              <q-list dense style="min-width: 100px">
                <q-item clickable>
                  <q-item-section>Cut</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Copy</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section>Paste</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable>
                  <q-item-section>Select All</q-item-section>
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
              <div
                style="height: 540px; background-color: darkgrey"
                class="column justify-center items-center"
              >
                <q-file
                  v-if="!video?.src"
                  v-model="file"
                  borderless
                  prefix="Upload"
                  @update:model-value="upload"
                >
                  <template v-slot:before>
                    <q-icon name="upload" size="lg" />
                  </template>
                </q-file>
                <video ref="video" width="960" height="540"></video>
              </div>
              <div style="height: 54px">
                <q-linear-progress
                  key="md"
                  size="md"
                  :value="seekProgress"
                  color="warning"
                />
                {{ seekTime }}
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
