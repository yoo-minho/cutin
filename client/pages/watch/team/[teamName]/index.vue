<script setup lang="ts">
import type { TeamInfoType, VsType } from "@/types";
import GameItem from "../components/GameItem.vue";
import TeamItem from "../components/TeamItem.vue";

definePageMeta({
  layout: "watch-detail",
});

const route = useRoute();
const { teamName: clubCode } = route.params;
const { tab = "" } = route.query;

const currentTeam = ref();
const currentTeamState = useState<TeamInfoType[]>("currentTeamState", () => []);
if (currentTeamState.value.length > 0) {
  currentTeam.value = currentTeamState.value.find(
    (team) => team.id === clubCode
  );
} else {
  const { data: clubs } = await useFetch<TeamInfoType[]>(`/api/club`);
  watch(
    clubs,
    (newData) => {
      if (newData) {
        currentTeamState.value = newData;
        currentTeam.value = currentTeamState.value.find(
          (team) => team.id === clubCode
        );
      }
    },
    { immediate: true }
  );
}

let tempDate = "";
const { data: games } = await useFetch<VsType[]>(`/api/club/${clubCode}/game`);
const currentVsState = useState<VsType[]>("currentVsState", () => []);
watch(
  games,
  (newData) => {
    if (!newData) return;
    currentVsState.value = newData
      .map((vs) => {
        return {
          ...vs,
          dateInfo: formatGameDate(vs.playDate, vs.gameNo),
          gameCode: `${clubCode}_${vs.playDate}_${vs.gameNo}`,
        };
      })
      .map((v: any) => {
        if (tempDate === v.playDate) {
          tempDate = v.playDate;
          return { ...v, label: false };
        } else {
          tempDate = v.playDate;
          return { ...v, label: true };
        }
      });
    tempDate = "";
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

const refTab = ref(String(tab) || "player");
watch(refTab, () => {
  const router = useRouter();
  router.replace({ query: { tab: refTab.value } });
});

const clubPlayer = computed(() => players.value?.filter((v) => !v.guest));
const guestPlayer = computed(() => players.value?.filter((v) => v.guest));
</script>
<template>
  <TeamItem :team="currentTeam" :type="'detail'" />
  <q-separator color="#ccc" class="q-mt-sm" />
  <q-tabs
    v-model="refTab"
    dense
    :class="`text-grey js-tab bg-white`"
    :active-color="`orange-5`"
    :indicator-color="`orange-5`"
  >
    <q-tab
      name="match"
      :label="`최근경기 (${currentVsState.length})`"
      style="flex: 1"
    />
    <q-tab
      name="player"
      :label="`멤버 기록 (${clubPlayer?.length})`"
      style="flex: 1"
    />
    <q-tab
      name="guest"
      :label="`게스트 기록 (${guestPlayer?.length})`"
      style="flex: 1"
    />
  </q-tabs>
  <q-tab-panels v-model="refTab" style="flex: 1; width: 100%">
    <q-tab-panel name="player" class="q-pa-none">
      <TableAllPlayerByClub :player-stat="clubPlayer" :guest="false" />
    </q-tab-panel>
    <q-tab-panel name="guest" class="q-pa-none">
      <TableAllPlayerByClub :player-stat="guestPlayer" :guest="true" />
    </q-tab-panel>
    <q-tab-panel name="match" class="q-pa-none">
      <q-list>
        <q-separator />
        <template v-for="vs in currentVsState">
          <div v-if="vs.label" style="background-color: #eee; padding: 4px">
            📅 {{ formatGameDate(vs.playDate) }}
          </div>
          <GameItem
            v-if="vs.gameCode"
            :vs="vs"
            type="TEAM"
            @click-btn="moveGame(vs.gameCode)"
          />
          <q-separator />
        </template>
      </q-list>
    </q-tab-panel>
  </q-tab-panels>
</template>
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
