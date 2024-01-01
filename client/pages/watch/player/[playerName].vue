<script setup lang="ts">
import type { TeamInfoType } from "~/types";

definePageMeta({
  layout: "watch-detail",
});
const route = useRoute();
const { playerName: _playerName } = route.params;
const playerName = String(_playerName);
const { clubCode: _clubCode } = route.query;
const clubCode = String(_clubCode);

const { data: clubs } = await useFetch<TeamInfoType[]>(`/api/club`);
const clubInfo = clubs.value?.find((club) => club.id === clubCode);

const _stats = ref([]);
const { data: stats } = await useFetch<any>(
  `/api/player/${playerName}/club/${clubCode}`
);
watch(
  stats,
  (newData) => {
    if (!newData) return;
    _stats.value = newData;
  },
  { immediate: true }
);

const goTeamPage = () => {
  if (history.state.back.indexOf("/watch/team/gba") === 0) {
    history.back();
  } else {
    navigateTo({ path: "/watch/team/gba" });
  }
};
</script>
<template>
  <q-item-label class="q-mx-sm q-mt-sm">
    <q-item class="q-px-sm q-pt-sm">
      <q-item-section>
        <q-item-label class="row items-center q-mb-xs">
          <div class="playerName">
            <span class="column">{{ playerName }}</span>
            <span class="in"> in </span>
            <span v-if="clubInfo && 'name' in clubInfo">
              <TableItemConnectVBtn
                :contents1="clubInfo.name"
                contents2="팀 들여다보기"
                @click="goTeamPage"
              />
            </span>
          </div>
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-item-label>
  <q-item-label v-if="_stats[0]?.['guest']" class="q-px-md q-pb-md">
    <q-item-label>
      <q-badge color="yellow" text-color="black" label="guest" />
    </q-item-label>
  </q-item-label>
  <q-item-label v-if="_stats.length > 0" class="q-px-md q-pb-md">
    <q-item-label class="subtitle q-pb-sm"> 플레이한 총 게임 수</q-item-label>
    {{ _stats[0]["play"] }}게임
  </q-item-label>
  <q-item-label class="q-px-md q-pb-md" style="overflow-y: scroll">
    <q-item-label class="subtitle q-pb-sm"> 게임 평균 스탯 </q-item-label>
    <TablePlayerStatsByClub :stats="_stats" />
  </q-item-label>
  <q-item-label
    v-if="clubInfo && 'name' in clubInfo"
    class="q-px-md q-pb-md"
    style="flex: 3; overflow-y: scroll"
  >
    <q-item-label class="subtitle q-pb-sm"> 게임별 스탯 + 영상 </q-item-label>
    <TablePlayerStatsGroupByGameByClub />
  </q-item-label>
</template>

<style lang="scss" scoped>
.playerName {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  font-size: 24px;
  line-height: 20px;
  letter-spacing: -3px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);

  .in {
    letter-spacing: 0;
  }
}

.subtitle {
  font-size: 16px;
  font-weight: bold;
  letter-spacing: -1px;
}
</style>
