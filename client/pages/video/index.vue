<script setup lang="ts">
const props = {
  clubCode: "gba",
  playDate: "20231104",
  gameNo: 1,
};

const playerArr = await findPlayer(props);
const xxx = await getCutsWithStat2(playerArr, props);
</script>
<template>
  <div
    class="column items-center align-center"
    style="background-color: whitesmoke"
  >
    <div class="text-h4">{{ props.clubCode }}</div>
    <div>{{ props.playDate }}</div>
    <div>{{ props.gameNo }}경기</div>
    <div class="q-mt-md">
      <div class="text-h6">{{ xxx[0].teamName }}</div>
      <div class="text-h5">{{ xxx[0].totalPts }}</div>
      <StatTable :player-stat="xxx[0].playerStat" />
    </div>
    <div class="q-mt-md">
      <div class="text-h6">{{ xxx[1].teamName }}</div>
      <div class="text-h5">{{ xxx[1].totalPts }}</div>
      <StatTable :player-stat="xxx[1].playerStat" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
body {
  margin: 0;
}
</style>
