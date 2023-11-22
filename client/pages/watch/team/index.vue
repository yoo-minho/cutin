<script setup lang="ts">
import type { TeamInfoType } from "@/types";
import TeamItem from "./components/TeamItem.vue";

definePageMeta({
  layout: "watch-main",
});

const exapmpleTeams = [
  {
    id: "gba",
    name: "GBA",
    place: "영등포제2스포츠센터(영등포구)",
    cycle: "매주 토요일 10시~12시",
    method: "8대8 2파전, 10분 4쿼터 2경기",
    memberCount: "32명",
  },
  {
    id: "xxx",
    name: "또 다른 팀을 모집합니다!",
    place: "어디서 하나요?",
    cycle: "언제 하나요?",
    method: "경기방식은 어떻게 되나요?",
    memberCount: "몇명?",
  },
];

const currentTeamState = useState<TeamInfoType[]>("currentTeamState", () => []);
currentTeamState.value = exapmpleTeams;

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
