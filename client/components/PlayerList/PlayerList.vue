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
    <q-chip
      outline
      square
      color="white"
      class="q-px-sm"
      style="letter-spacing: -2px; height: auto; width: 70px"
    >
      <div class="column">
        <div class="text-center">{{ teamName }}팀</div>
      </div>
    </q-chip>

    <q-icon name="forward" class="text-white"></q-icon>

    <q-chip
      v-for="(player, idx) in playerStore"
      clickable
      outline
      square
      color="orange"
      class="q-px-sm row"
      style="letter-spacing: -2px; height: auto"
      @click="removePlayer(player.name)"
    >
      <div class="column">
        <div class="key">
          <div class="keycap">{{ keyCommand[idx] }}</div>
        </div>
        <div>{{ player.name }}</div>
      </div>
    </q-chip>
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
<style lang="scss" scoped>
.key {
  width: 46px;
  height: 46px;
  border-width: 3px 7px 10px;
  border-style: solid;
  border-radius: 4px;
}
.key.pressed {
  -webkit-transform: scale(0.95, 0.95);
  -moz-transform: scale(0.95, 0.95);
  -ms-transform: scale(0.95, 0.95);
  -o-transform: scale(0.95, 0.95);
  transform: scale(0.95, 0.95);
}

.key {
  background: #d3cfcc;
  border-color: #ece8e4 #dedad6 #c9c4c4;
}

.key .keycap {
  width: 33px;
  height: 33px;
  padding: 5px 0 0 7px;
  font-size: 16px;
  line-height: 1;
  background: #f5f3f1;
  background: -webkit-linear-gradient(left, #e5e2e1, #f5f3f1, #e5e2e1);
  background: -moz-linear-gradient(left, #e5e2e1, #f5f3f1, #e5e2e1);
  background: -ms-linear-gradient(left, #e5e2e1, #f5f3f1, #e5e2e1);
  background: -o-linear-gradient(left, #e5e2e1, #f5f3f1, #e5e2e1);
  background: linear-gradient(to right, #e5e2e1, #f5f3f1, #e5e2e1);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  position: relative;
}
</style>
