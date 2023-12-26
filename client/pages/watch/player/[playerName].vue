<script setup lang="ts">
import { getTeams } from "@/server/data/gameTeam";

definePageMeta({
  layout: "watch-detail",
});
const route = useRoute();
const { playerName: _playerName } = route.params;
const playerName = String(_playerName);
const { clubCode: _clubCode } = route.query;
const clubCode = String(_clubCode);
const { data: clubInfo } = getTeams(clubCode);

const selectVal = ref();
</script>
<template>
  <q-item-label class="q-mx-sm q-mt-sm">
    <q-item class="q-px-sm q-pt-sm">
      <q-item-section>
        <q-item-label class="row items-center q-mb-xs">
          <div class="playerName">{{ playerName }}</div>
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-item-label>
  <q-item-label class="q-px-md q-pb-md">
    <q-item-label class="subtitle q-pb-sm"> 평균스탯 </q-item-label>
    <TablePlayerStatsGroupByClub />
  </q-item-label>
  <q-item-label v-if="clubInfo && 'name' in clubInfo" class="q-px-md q-pb-md">
    <q-item-label class="subtitle q-pb-sm">
      <q-select filled v-model="model" :options="options" label="Standard" />
      {{ clubInfo.name }} 경기 스탯
    </q-item-label>
    <TablePlayerStatsGroupByGameByClub />
  </q-item-label>
</template>

<style lang="scss" scoped>
.playerName {
  font-weight: bold;
  font-size: 24px;
  line-height: 20px;
  letter-spacing: -3px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
}

.subtitle {
  font-size: 16px;
  font-weight: bold;
  letter-spacing: -1px;
}
</style>
