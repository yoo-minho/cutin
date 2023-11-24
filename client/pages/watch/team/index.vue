<script setup lang="ts">
import type { TeamInfoType } from "@/types";
import TeamItem from "./components/TeamItem.vue";
import { getTeams } from "~/server/data/gameTeam";

definePageMeta({
  layout: "watch-main",
});

const { data } = await getTeams();

const currentTeamState = useState<TeamInfoType[]>("currentTeamState", () => []);
currentTeamState.value = data as TeamInfoType[];

const showTeamGame = (teamId: string) => {
  const route = useRoute();
  const routePath = route.path;
  navigateTo(routePath + "/" + teamId);
};
</script>
<template>
  <div v-for="team in currentTeamState" @click="showTeamGame(team.id)">
    <TeamItem :team="team" />
    <q-separator class="q-my-sm" />
  </div>
</template>

<style lang="scss" scoped></style>
