<script setup lang="ts">
const props = defineProps<{
  playerName: string;
  videoName: string;
  teamName: string;
}>();

const _updateCut = async (e: any) => {
  if (e.ctrlKey) {
    await updateCutV2("subPlayer", props.playerName);
  } else {
    await updateCutV2("mainPlayer", props.playerName);
  }
  (document.activeElement as HTMLBodyElement).blur();
};

const _removePlayer = (name: string) => {
  Dialog.create({
    title: "선수 제거",
    ok: "제거",
    cancel: "취소",
  }).onOk(() => {
    removePlayerOnTeam(props.videoName, props.teamName, name);
  });
};
</script>
<template>
  <q-btn dense text-color="white" color="grey-9" @click="_updateCut">
    {{ playerName }}
    <q-btn
      flat
      round
      dense
      color="primary"
      icon="clear"
      text-color="white"
      size="xs"
      @click="
        (e) => {
          e.stopPropagation();
          _removePlayer(playerName);
        }
      "
    />
  </q-btn>
  <!-- <q-btn-dropdown
    padding="6px 0 6px 6px"
    text-color="white"
    color="grey-9"
    :label="playerName"
  >
    <q-list>
      <q-item
        clickable
        v-close-popup
        @click="(e) => _updateCut(e, 'mainPlayer', playerName)"
      >
        <q-item-section>메인플레이어로 기록</q-item-section>
        <q-item-section side>
          <q-icon name="sports_basketball" />
        </q-item-section>
      </q-item>
      <q-item
        clickable
        v-close-popup
        @click="(e) => _updateCut(e, 'subPlayer', playerName)"
      >
        <q-item-section>서브플레이어로 기록</q-item-section>
        <q-item-section side>
          <q-icon name="directions_bus_filled" />
        </q-item-section>
      </q-item>
      <hr />
      <q-item clickable v-close-popup @click="_removePlayer(playerName)">
        <q-item-section>선수 삭제</q-item-section>
        <q-item-section side>
          <q-icon name="delete" />
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown> -->
</template>
<style lang="scss" scoped>
.q-btn-dropdown--split .q-btn-dropdown__arrow-container {
  font-size: 10px;
  width: 20px;
}
</style>
