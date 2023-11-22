<script setup lang="ts">
import GameItem from "../../components/GameItem.vue";

definePageMeta({
  layout: "watch-detail",
});

const route = useRoute();
const gameCode = route.params.gameCode as string;
const [clubCode, playDate, gameNo] = gameCode.split("_");
const props = { clubCode, playDate, gameNo: +gameNo };
const playerArr = await findPlayer(props);
const [aTeam, bTeam] = await getCutsWithStat2(playerArr, props);

const currentVsState = useState<VsType[]>("currentVsState", () => []);
const currentVs = ref();
if (currentVsState.value.length > 0) {
  currentVs.value = currentVsState.value.find((vs) => vs.gameCode === gameCode);
} else {
  const { data } = await useFetch<VsType[]>("/api/gameStat/match", {
    params: { gameCode },
  });
  currentVs.value = data.value[0];
}
</script>
<template>
  <q-card>
    <GameItem :vs="currentVs" />
    <q-separator color="#ccc" class="q-py-xs" />
    <q-card-section>
      <div class="column items-center align-center">
        <div>
          <div class="text-h6">{{ aTeam?.teamName }}</div>
          <StatTable :player-stat="aTeam?.playerStat" />
        </div>
        <div class="q-mt-md">
          <div class="text-h6">{{ bTeam?.teamName }}</div>
          <StatTable :player-stat="bTeam?.playerStat" />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<style lang="scss" scoped>
.teamName {
  font-size: 24px;
  font-weight: bold;
}
.score {
  font-size: 36px;
  font-weight: bolder;

  &.win {
    color: #ff8c00;
  }
}
</style>
