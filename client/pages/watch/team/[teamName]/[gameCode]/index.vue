<script setup lang="ts">
import type { VsType, RecordType } from "@/types";
import GameItem from "../../components/GameItem.vue";

definePageMeta({
  layout: "watch-detail",
});

const route = useRoute();
const { teamName: clubCode, gameCode } = route.params;
const { data: record } = await useFetch<[RecordType, RecordType]>(
  `/api/club/${clubCode}/game/${gameCode}/record`
);
const [aTeam, bTeam] = record.value || [];

const currentVsState = useState<VsType[]>("currentVsState", () => []);
const currentVs = ref();
if (currentVsState.value.length > 0) {
  currentVs.value = currentVsState.value.find((vs) => vs.gameCode === gameCode);
} else {
  const { data } = await useFetch<VsType[]>(
    `/api/club/${clubCode}/game/${gameCode}`
  );
  if (data.value) {
    currentVs.value = data.value.map((vs) => {
      return {
        ...vs,
        dateInfo: formatGameDate(vs.playDate, vs.gameNo),
        gameCode,
      };
    })[0];
  }
}
</script>
<template>
  <GameItem :vs="currentVs" type="MATCH" />
  <q-separator color="#ccc" />
  <div class="text-center q-mt-md text-orange-5">
    * 정렬조건 : KBL 선수공헌도 높은순<br />
    (득점+스틸+블록+수비리바)x1.0 + (공격리바+어시)x1.5
  </div>
  <div
    class="column items-center align-center"
    style="flex: 1; overflow-y: auto; flex-wrap: nowrap"
  >
    <template v-if="aTeam">
      <div class="text-h6 q-mt-md">{{ aTeam.teamName }}</div>
      <StatTable :player-stat="aTeam.playerStat" />
    </template>
    <template v-if="bTeam" class="q-mt-md">
      <div class="text-h6 q-mt-md">{{ bTeam.teamName }}</div>
      <StatTable :player-stat="bTeam.playerStat" />
    </template>
  </div>
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
