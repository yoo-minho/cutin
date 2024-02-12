<script setup lang="ts">
const gameTab = ref("1"),
  quaterTab = ref("1");
const currGame = useCurrGame();
watch([gameTab, quaterTab], ([g, q]) => (currGame.value = g + "g" + q + "q"));
watch(currGame, () => {
  const [gameNo, quaterNo] = currGame.value.split(/g|q/g, 2);
  gameTab.value = gameNo;
  quaterTab.value = quaterNo;
  (document.activeElement as HTMLBodyElement).blur();
});
</script>
<template>
  <div class="row bg-dark text-white full-height" style="justify-content: space-around">
    <q-tabs v-model="gameTab" dense active-bg-color="orange" active-color="dark" align="left">
      <div class="q-px-md">GAME</div>
      <q-tab name="1" label="1게임" class="col" />
      <q-tab name="2" label="2게임" class="col" />
      <q-tab name="3" label="3게임" class="col" />
      <q-tab name="4" label="4게임" class="col" />
    </q-tabs>
    <q-tabs v-model="quaterTab" dense active-bg-color="orange" active-color="dark" align="left">
      <div class="q-px-md">QUATER</div>
      <q-tab name="1" label="1쿼터" class="col" />
      <q-tab name="2" label="2쿼터" class="col" />
      <q-tab name="3" label="3쿼터" class="col" />
      <q-tab name="4" label="4쿼터" class="col" />
    </q-tabs>
  </div>
</template>
