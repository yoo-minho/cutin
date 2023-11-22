<script setup lang="ts">
import GameItem from "../../components/GameItem.vue";

const route = useRoute();
const gameCode = route.params.gameCode as string;
const [clubCode, playDate, gameNo] = gameCode.split("_");
const props = { clubCode, playDate, gameNo: +gameNo };
const playerArr = await findPlayer(props);
const [aTeam, bTeam] = await getCutsWithStat2(playerArr, props);

const currentVsState = useState<VsType[]>("currentVsState", () => []);
const currentVs = currentVsState.value.find((vs) => vs.gameCode === gameCode);
</script>
<template>
  <q-card>
    <GameItem :vs="currentVs" />
    <q-separator />
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
