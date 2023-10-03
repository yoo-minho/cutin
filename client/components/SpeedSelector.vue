<script setup lang="ts">
const props = defineProps<{ video: HTMLVideoElement }>();
const speed = ref(1.5);
const speedSet = [1.0, 1.25, 1.5, 1.75, 2.0, 2.25, 2.5];
const moveSet = [3, 5] as (3 | 5)[];

const controlState = useControlState();

function selectSpeed(s: number) {
  speed.value = s;
  props.video.playbackRate = s;
}
</script>
<template>
  <div class="row" style="gap: 24px">
    <div>
      <div class="label">
        <q-btn label="재생속도" dense flat />
      </div>
      <q-btn-dropdown text-color="white" flat :label="`X ${speed}`">
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
    </div>
    <div>
      <div class="label">
        <q-btn label="빨리감기" icon-right="info" dense flat>
          <q-tooltip
            anchor="top middle"
            self="bottom middle"
            class="bg-green text-body2"
            :offset="[10, 10]"
          >
            1. 영상 플레이 중 우방향키로 빨리감기 (중간화면 빠르게 지나감)<br />
            2. 일시정지 중에 우방향키로 빨리감기 (중간화면 생략)<br />
            3. 영상 플레이 중 컨트롤 + 우방향키로 빨리감기 (중간화면 생략)
          </q-tooltip>
        </q-btn>
      </div>
      <q-btn-dropdown
        text-color="white"
        flat
        :label="`${controlState.fastForwardSec}초`"
      >
        <q-list>
          <q-item
            v-for="s in moveSet"
            clickable
            v-close-popup
            @click="controlState.fastForwardSec = s"
          >
            <q-item-section>
              <q-item-label>{{ s }}초</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>
    <div>
      <div class="label">
        <q-btn label="되감기" icon-right="info" dense flat>
          <q-tooltip
            anchor="top middle"
            self="bottom middle"
            class="bg-green text-body2"
            :offset="[10, 10]"
          >
            1. 좌방향키로 되감기 (중간화면 생략)
          </q-tooltip>
        </q-btn>
      </div>
      <q-btn-dropdown
        text-color="white"
        flat
        :label="`${controlState.rewindSec}초`"
      >
        <q-list>
          <q-item
            v-for="s in moveSet"
            clickable
            v-close-popup
            @click="controlState.rewindSec = s"
          >
            <q-item-section>
              <q-item-label>{{ s }}초</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>
  </div>
</template>
<style scoped>
.q-btn-dropdown {
  padding: 0 4px 0 16px;
  min-height: auto;
  font-size: 20px;
}
.label button {
  color: #fff !important;
  padding: 0 0.285em;
  min-height: auto;
}
.label span {
  font-size: 11px;
}
</style>
