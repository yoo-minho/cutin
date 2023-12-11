<script setup lang="ts">
import type { PlayerType } from "@/composables/playerState";

const videoProps = useVideoPropsStore();

const props = defineProps<{
  videoName: string;
  teamName: string;
  players: PlayerType[];
}>();

const _addPlayer = () => {
  Dialog.create({
    title: "선수 추가",
    message: "가나다 순으로 추가됩니다!",
    prompt: {
      type: "text",
    },
    ok: "추가",
    cancel: "취소",
  }).onOk((val: string) => {
    addPlayerOnTeam(props.videoName, props.teamName, val);
  });
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

const _removeTeam = () => {
  Dialog.create({
    title: "팀 제거",
    ok: "제거",
    cancel: "취소",
  }).onOk(() => {
    removeTeam(props.videoName, props.teamName);
  });
};

const _updateCut = async (
  type: "mainPlayer" | "subPlayer" | "skill" | "videoUrl" | "seekTime",
  value: string
) => {
  await updateCut(type, value);
  videoProps.value.videoEl?.focus();
};
</script>
<template>
  <div class="row items-center q-mb-md">
    <q-btn-dropdown
      :label="`${teamName} 팀`"
      color="orange-9"
      padding="6px 0 6px 12px"
      style="width: 120px"
    >
      <q-list>
        <q-item clickable v-close-popup @click="_addPlayer()">
          <q-item-section>선수 추가</q-item-section>
          <q-item-section side>
            <q-icon name="add" />
          </q-item-section>
        </q-item>
        <q-item clickable v-close-popup @click="_removeTeam()">
          <q-item-section>팀 삭제</q-item-section>
          <q-item-section side>
            <q-icon name="delete" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>

    <div class="row" style="gap: 8px; margin: 0 8px; font-size: 6px">
      <q-btn-dropdown
        v-for="player in players"
        padding="6px 0 6px 6px"
        text-color="white"
        color="grey-9"
        :label="player.name"
      >
        <q-list>
          <q-item
            clickable
            v-close-popup
            @click="_updateCut('mainPlayer', player.name)"
          >
            <q-item-section>메인플레이어로 기록</q-item-section>
            <q-item-section side>
              <q-icon name="sports_basketball" />
            </q-item-section>
          </q-item>
          <q-item
            clickable
            v-close-popup
            @click="_updateCut('subPlayer', player.name)"
          >
            <q-item-section>서브플레이어로 기록</q-item-section>
            <q-item-section side>
              <q-icon name="directions_bus_filled" />
            </q-item-section>
          </q-item>
          <hr />
          <q-item clickable v-close-popup @click="_removePlayer(player.name)">
            <q-item-section>선수 삭제</q-item-section>
            <q-item-section side>
              <q-icon name="delete" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>
  </div>
</template>
<style>
.q-btn-dropdown--split .q-btn-dropdown__arrow-container {
  font-size: 10px;
  width: 20px;
}
</style>
