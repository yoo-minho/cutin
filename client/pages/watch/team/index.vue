<script setup lang="ts">
import type { TeamInfoType } from "@/types";
import TeamItem from "./components/TeamItem.vue";
import { getTeams } from "~/server/data/gameTeam";

definePageMeta({
  layout: "watch-main",
});

const _title = "컷인 | 우리의 농구를 더욱 특별하게";
const _desc = "농구 영상 편집 & 스탯 기록 & 배포를 쉽게 하는 플랫폼";

useHead({
  title: _title,
  meta: [
    { name: "description", content: _desc },
    { property: "og:title", content: _title },
    { property: "og:description", content: _desc },
    { property: "og:type", content: "website" },
    { property: "og:url", content: `https://cutin.cc` },
    { property: "og:locale", content: "ko_KR" },
    { property: "og:image", content: "https://cutin.cc/og-image.png" },
  ],
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
