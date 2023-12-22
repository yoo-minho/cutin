<script setup lang="ts">
import type { TeamInfoType, VsType } from "@/types";
import GameItem from "../components/GameItem.vue";
import TeamItem from "../components/TeamItem.vue";
import { getTeams } from "@/server/data/gameTeam";

definePageMeta({
  layout: "watch-detail",
});

const route = useRoute();
const { teamName: clubCode } = route.params;

const currentTeam = ref();
const currentTeamState = useState<TeamInfoType[]>("currentTeamState", () => []);
if (currentTeamState.value.length > 0) {
  currentTeam.value = currentTeamState.value.find(
    (team) => team.id === clubCode
  );
} else {
  const { data: team } = await getTeams(clubCode);
  currentTeam.value = team;
}

const { data: games } = await useFetch<VsType[]>(`/api/club/${clubCode}/game`);
const currentVsState = useState<VsType[]>("currentVsState", () => []);
watch(
  games,
  (newData) => {
    if (!newData) return;
    currentVsState.value = newData.map((vs) => {
      return {
        ...vs,
        dateInfo: formatGameDate(vs.playDate, vs.gameNo),
        gameCode: `${clubCode}_${vs.playDate}_${vs.gameNo}`,
      };
    });
  },
  { immediate: true }
);

const { data: players } = await useFetch<VsType[]>(
  `/api/club/${clubCode}/player`
);

const moveGame = (gameCode: string) => {
  const route = useRoute();
  const router = useRouter();
  router.push(route.path + "/" + gameCode);
};

const tab2 = ref("match");
</script>
<template>
  <TeamItem :team="currentTeam" />
  <q-separator color="#ccc" class="q-mt-sm" />
  <q-tabs
    v-model="tab2"
    dense
    :class="`text-grey js-tab bg-white`"
    :active-color="`orange-5`"
    :indicator-color="`orange-5`"
  >
    <q-tab name="match" :label="`최근경기 (${currentVsState.length}게임)`" />
    <q-tab name="player" :label="`선수 (${players?.length}명)`" />
  </q-tabs>
  <q-tab-panels v-model="tab2" style="flex: 1; width: 100%">
    <q-tab-panel name="match" class="q-pa-none">
      <div class="text-center q-mt-md text-orange-5">
        * 정렬조건 : 경기일자 최근순
      </div>
      <q-list>
        <q-separator />
        <template v-for="vs in currentVsState">
          <GameItem
            v-if="vs.gameCode"
            :vs="vs"
            type="TEAM"
            @click="moveGame(vs.gameCode)"
          />
          <q-separator />
        </template>
      </q-list>
    </q-tab-panel>
    <q-tab-panel name="player" class="q-pa-none">
      <TablePlayerByClub :player-stat="players" />
    </q-tab-panel>
  </q-tab-panels>
</template>
<style lang="scss">
.q-panel.scroll {
  overflow: hidden !important;
}
</style>

<style lang="scss" scoped>
.scroll {
  overflow: hidden !important;
}

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
