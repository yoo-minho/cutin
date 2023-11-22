<script setup lang="ts">
import type { VsType } from "@/types";
import GameItem from "../components/GameItem.vue";
const route = useRoute();
const teamName = route.params.teamName as string;

const exapmpleVs = [
  {
    gameCode: "gba_20231104_1",
    playDate: "20231104",
    gameNo: 1,
    dateInfo: "2023.11.4.(토) 1게임",
    aTeamName: "화이트",
    aScore: 70,
    bTeamName: "블랙",
    bScore: 60,
  },
  {
    gameCode: "gba_20231104_2",
    dateInfo: "2023.11.4.(토) 2게임",
    aTeamName: "화이트",
    aScore: 67,
    bTeamName: "블랙",
    bScore: 91,
  },
];

const { data } = await useFetch<VsType[]>("/api/gameStat/match", {
  params: { clubCode: teamName },
});
const currentVsState = useState<VsType[]>("currentVsState", () => []);
currentVsState.value = (data.value || []).map((vs) => {
  return {
    ...vs,
    dateInfo: formatGameDate(vs.playDate, vs.gameNo),
    gameCode: `${teamName}_${vs.playDate}_${vs.gameNo}`,
  };
});

const moveGame = (gameCode: string) => {
  const route = useRoute();
  const router = useRouter();
  router.push(route.path + "/" + gameCode);
};
</script>
<template>
  <q-list bordered>
    <template v-for="vs in currentVsState">
      <GameItem v-if="vs.gameCode" :vs="vs" @click="moveGame(vs.gameCode)" />
      <q-separator />
    </template>
  </q-list>
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
