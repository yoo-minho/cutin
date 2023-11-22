<script setup lang="ts">
import type { TeamInfoType, VsType } from "@/types";
import GameItem from "../components/GameItem.vue";
import TeamItem from "../components/TeamItem.vue";

definePageMeta({
  layout: "watch-detail",
});

const route = useRoute();
const teamName = route.params.teamName as string;

const { data } = await useFetch<VsType[]>("/api/gameStat/match", {
  params: { clubCode: teamName },
});

const currentTeam = ref();
const currentTeamState = useState<TeamInfoType[]>("currentTeamState", () => []);
if (currentTeamState.value.length > 0) {
  currentTeam.value = currentTeamState.value.find(
    (team) => team.id === teamName
  );
}

const currentVsState = useState<VsType[]>("currentVsState", () => []);
watch(
  data,
  (newData) => {
    if (!newData) return;
    currentVsState.value = newData.map((vs) => {
      return {
        ...vs,
        dateInfo: formatGameDate(vs.playDate, vs.gameNo),
        gameCode: `${teamName}_${vs.playDate}_${vs.gameNo}`,
      };
    });
  },
  { immediate: true }
);

const moveGame = (gameCode: string) => {
  const route = useRoute();
  const router = useRouter();
  router.push(route.path + "/" + gameCode);
};
</script>
<template>
  <TeamItem :team="currentTeam" />
  <q-separator color="#ccc" class="q-py-xs" />
  <q-list>
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
