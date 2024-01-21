<script setup lang="ts">
const props = defineProps<{
  playerName: string;
  videoName: string;
  teamName: string;
  shortKey: string;
}>();

const _updateSubCut = async () => {
  await updateCutV2("subPlayer", props.playerName);
  (document.activeElement as HTMLBodyElement).blur();
};

const _updateCut = async (e: any) => {
  if (e.ctrlKey) {
    _updateSubCut();
    return;
  }
  await updateCutV2("mainPlayer", props.playerName);
  (document.activeElement as HTMLBodyElement).blur();
};

const _removePlayer = (e: Event) => {
  e.stopPropagation();
  Dialog.create({
    title: "선수 제거",
    ok: "제거",
    cancel: "취소",
  }).onOk(() => {
    removePlayerOnTeam(props.videoName, props.teamName, props.playerName);
  });
};
</script>
<template>
  <q-btn dense text-color="white" color="grey-9" @click="_updateCut">
    <div>
      <div>{{ playerName }}</div>
      <div style="font-size: 12px; display: flex; align-items: center">
        <q-icon name="keyboard" class="q-px-xs" size="16px" />{{ shortKey }}
      </div>
    </div>
    <q-btn
      flat
      round
      dense
      color="primary"
      icon="more_vert"
      text-color="white"
      size="xs"
      @click="(e) => e.stopPropagation()"
    >
      <q-menu dense>
        <q-list style="min-width: 100px">
          <q-item clickable v-close-popup @click="_updateSubCut">
            <q-item-section style="flex-direction: row; align-items: center">
              서브플레이어로 기록
              <span style="font-size: 12px; display: flex; align-items: center">
                (<q-icon name="keyboard" class="q-px-xs" size="16px" /> A + 1)
              </span>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click="_removePlayer">
            <q-item-section>삭제</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </q-btn>
</template>
