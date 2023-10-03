<script setup lang="ts">
const props = defineProps<{ code: string; teamName: string }>();
const teamStore = useTeamStore(props.code);
const players = ref<any[]>([]);
watch(teamStore, () => {
  players.value =
    teamStore.value.find((v) => v.name === props.teamName)?.players || [];
});

const _addPlayer = () => {
  Dialog.create({
    title: "선수 추가",
    prompt: {
      type: "text",
    },
    ok: "추가",
    cancel: "취소",
  }).onOk((val: string) => {
    addPlayerOnTeam(props.code, props.teamName, val);
  });
};

const _removePlayer = (name: string) => {
  Dialog.create({
    title: "선수 제거",
    ok: "제거",
    cancel: "취소",
  }).onOk(() => {
    removePlayerOnTeam(props.code, props.teamName, name);
  });
};

const _removeTeam = () => {
  Dialog.create({
    title: "팀 제거",
    ok: "제거",
    cancel: "취소",
  }).onOk(() => {
    removeTeam(props.code, props.teamName);
  });
};

const selectPlayer = (playerName: string) => {
  console.log("xxxx", playerName);
};
</script>
<template>
  <div class="row items-center q-mb-md">
    <q-btn-dropdown
      :label="`팀 ${teamName}`"
      color="green-9"
      padding="6px 0 6px 12px"
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
        @click="selectPlayer(player.name)"
      >
        <q-list>
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
