<script setup lang="ts">
import { useQuasar } from "quasar";
import { keySet } from "~/composables/constants";

const props = defineProps<{ teamName: string }>();
const playerStore = usePlayerStore(props.teamName);
const teamName = props.teamName;
const keyCommand =
  "A" === teamName ? keySet.first : "B" === teamName ? keySet.second : [];

const prompt = ref(false);
const playerName = ref("");

const $q = useQuasar();

const openPop = () => {
  prompt.value = true;
  playerName.value = "";
};

const addPlayer = () => {
  playerStore.value.push({ name: playerName.value });
  prompt.value = false;
  playerName.value = "";
};

const removePlayer = (name: string) => {
  $q.dialog({
    title: "선수제거",
    ok: "제거",
    cancel: "취소",
  }).onOk(() => {
    const newStore = playerStore.value.filter((player) => player.name !== name);
    playerStore.value = newStore;
  });
};
</script>
<template>
  <div class="row items-center">
    <KeyCap :label="teamName + '팀'" style="width: 80px" />
    <q-icon name="forward" class="text-white"></q-icon>
    <KeyCap
      v-for="(player, idx) in playerStore"
      color="orange"
      :command="keyCommand[idx]"
      :label="player.name"
      clickable
      @click="() => removePlayer(player.name)"
    />
    <q-chip
      clickable
      outline
      square
      color="white"
      class="q-px-sm"
      icon="add"
      @click="openPop()"
    >
      선수추가
    </q-chip>
    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">선수</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input
            v-model="playerName"
            dense
            autofocus
            color="orange"
            @keyup.enter="addPlayer()"
          />
        </q-card-section>
        <q-card-actions align="right" class="text-orange">
          <q-btn flat label="취소" v-close-popup />
          <q-btn flat label="추가" v-close-popup @click="addPlayer()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
