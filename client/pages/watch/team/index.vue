<script setup lang="ts">
import TeamItem from "./components/TeamItem.vue";

const exapmpleTeams = [
  {
    id: "gba",
    name: "GBA",
    place: "영등포제2스포츠센터(영등포구)",
    cycle: "매주 토요일 10시~12시",
    method: "8대8 2파전, 10분 4쿼터 2경기",
    memberCount: 31,
  },
  {
    id: "gba",
    name: "GBA",
    place: "영등포제2스포츠센터(영등포구)",
    cycle: "매주 토요일 10시~12시",
    method: "8대8 2파전, 10분 4쿼터 2경기",
    memberCount: 31,
  },
  {
    id: "gba",
    name: "GBA",
    place: "영등포제2스포츠센터(영등포구)",
    cycle: "매주 토요일 10시~12시",
    method: "8대8 2파전, 10분 4쿼터 2경기",
    memberCount: 31,
  },
];

const showTeamGame = (teamId: string) => {
  const [route, router] = [useRoute(), useRouter()];
  const routePath = route.path;
  navigateTo(routePath + "/" + teamId);
};
</script>
<template>
  <div v-for="team in exapmpleTeams" @click="showTeamGame(team.id)">
    <TeamItem :team="team" />
  </div>
</template>

<style lang="scss" scoped></style>
