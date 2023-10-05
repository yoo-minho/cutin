<script setup lang="ts">
let intervalId: any;

const t = ref(0);
const formatT = computed(() => formatTime(t.value));
const playOn = ref(false);

function toggleStartPause() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    playOn.value = false;
  } else {
    intervalId = setInterval(updateStopwatch, 10);
    playOn.value = true;
  }
}

function resetStopwatch() {
  clearInterval(intervalId);
  intervalId = null;
  t.value = 0;
  playOn.value = false;
}

function updateStopwatch() {
  t.value += 10;
}

function formatTime(milliseconds: number) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((milliseconds % 1000) / 10);
  return `${minutes}:${String(seconds).padStart(2, "0")}.${String(
    centiseconds
  ).padStart(2, "0")}`;
}
</script>
<template>
  <div class="column">
    <span class="row items-center">
      <span style="font-size: 16px; margin-right: 4px">
        편집시간 : {{ formatT }}
      </span>
      <q-btn
        flat
        round
        dense
        :icon="playOn ? 'pause' : 'play_arrow'"
        size="11px"
        @click="toggleStartPause()"
      />
      <q-btn
        flat
        round
        dense
        icon="stop"
        size="11px"
        @click="resetStopwatch()"
      />
    </span>
  </div>
</template>

<style lang="scss" scoped></style>
