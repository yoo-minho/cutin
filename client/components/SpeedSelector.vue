<script setup lang="ts">
const props = defineProps<{ video: HTMLVideoElement }>();
const speed = ref(1.5);
const speedSet = [1.0, 1.25, 1.5, 1.75, 2.0, 2.25, 2.5];

function selectSpeed(s: number) {
  speed.value = s;
  props.video.playbackRate = s;
}
</script>
<template>
  <q-btn-dropdown :label="`X ${speed}`" text-color="white" size="1.1rem" flat>
    <q-list>
      <q-item
        v-for="s in speedSet"
        clickable
        v-close-popup
        @click="selectSpeed(s)"
      >
        <q-item-section>
          <q-item-label>X {{ s }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>
