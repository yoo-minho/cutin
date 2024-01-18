<script setup lang="ts">
import type { VsType } from "@/types";

const route = useRoute();
const { playerName: _playerName } = route.params;
const playerName = String(_playerName);
const { clubCode: _clubCode } = route.query;
const clubCode = String(_clubCode);

const currentVsState = useState<VsType[]>("currentVsState", () => []);

const _stats = ref([]);
const { data: stats } = await useFetch<any>(
  `/api/club/${clubCode}/player/${playerName}`
);
watch(
  stats,
  (newData) => {
    if (!newData) return;
    _stats.value = newData.map((v: any) => {
      currentVsState.value.forEach((vs) => {
        if (v.playDate === vs.playDate && v.gameNo === vs.gameNo) {
          v.match = vs.match;
        }
      });
      return v;
    });
  },
  { immediate: true }
);

const columns = [
  {
    label: "경기",
    name: "game",
    field: "game",
    align: "left",
  },
  {
    label: "결과",
    name: "result",
    field: "result",
    align: "center",
  },
  {
    label: "득점",
    name: "pts",
    field: "pts",
    align: "center",
  },
  {
    label: "리바",
    name: "reb",
    field: "reb",
    align: "center",
  },
  {
    label: "어시",
    name: "ast",
    field: "ast",
    align: "center",
  },
  {
    label: "3점",
    name: "tpm",
    field: "tpm",
    align: "center",
  },
  {
    label: "공리",
    name: "orb",
    field: "orb",
    align: "center",
  },
  {
    label: "스틸",
    name: "stl",
    field: "stl",
    align: "center",
  },
  {
    label: "블락",
    name: "blk",
    field: "blk",
    align: "center",
  },
] as any;

let tempDate = "";
const playerStat = _stats.value.map((v: any) => {
  if (tempDate === v.playDate) {
    tempDate = v.playDate;
    return { ...v, label: false };
  } else {
    tempDate = v.playDate;
    return { ...v, label: true };
  }
});

const _cuts = ref();
const videoViewerOn = ref(false);
const selectedPlayDate = ref("");
const selectedGameNo = ref("");
const openViewer = async (props: {
  clubCode: string;
  playDate: string;
  gameNo: string;
  playerName: string;
}) => {
  const { clubCode, playDate, gameNo, playerName } = props;
  const allGameCuts = await fetchAllGameCut({ clubCode, playDate, gameNo }); //매번 불러오는 비효율
  _cuts.value = allGameCuts.filter(
    (cut) => cut.mainPlayer === playerName || cut.subPlayer === playerName
  );
  const isNotReadyVideo =
    _cuts.value.filter((cut: any) => !cut.videoUrl).length > 0;
  if (isNotReadyVideo) {
    Notify.create("영상을 준비중입니다!");
    return;
  }
  selectedPlayDate.value = playDate;
  selectedGameNo.value = gameNo;
  videoViewerOn.value = true;
};
const getSelectedStat = (playDate: string, gameNo: string) =>
  _stats.value.find((v: any) => v.playDate === playDate && v.gameNo === gameNo);

const matchResult = (props: any) => {
  const { match, teamName } = props;
  if (!match || match.length === 0) return "draw";
  if (match[0].score < match[1].score) {
    if (match[1].teamName === teamName) return "win";
    return "lose";
  } else if (match[0].score > match[1].score) {
    if (match[0].teamName === teamName) return "win";
    return "lose";
  } else {
    return "draw";
  }
};

const moveGame = (playDate: string, gameNo: number) => {
  console.log("moveGame", { playDate, gameNo });
  navigateTo(`/watch/team/${clubCode}/${clubCode}_${playDate}_${gameNo}`);
};
</script>
<template>
  <q-table
    flat
    bordered
    dense
    :columns="columns"
    :rows="playerStat"
    row-key="name"
    :rows-per-page-options="[0]"
    :hide-pagination="true"
  >
    <template #body="props">
      <q-tr v-if="props.row.label" :props="props">
        <q-td
          colspan="100%"
          style="background-color: #eee; padding: 0 8px !important"
        >
          📅 {{ formatGameDate(props.row.playDate) }}
        </q-td>
      </q-tr>
      <q-tr :props="props">
        <q-td
          key="game"
          :props="props"
          class="game"
          style="padding: 0 8px !important"
        >
          <TableItemConnectHBtn
            :contents1="`${props.row.gameNo}게임`"
            contents2="영상보기"
            @click="
              openViewer({
                clubCode,
                playDate: props.row.playDate,
                gameNo: props.row.gameNo,
                playerName,
              })
            "
          />
        </q-td>
        <q-td key="result" :props="props">
          <template v-if="matchResult(props.row) === 'win'">
            <q-btn
              dense
              class="q-py-none q-my-xs bg-green-4 text-white sub"
              @click="moveGame(props.row.playDate, props.row.gameNo)"
            >
              <span style="flex: 1">승리</span>
            </q-btn>
          </template>
          <template v-else-if="matchResult(props.row) === 'lose'">
            <q-btn
              dense
              class="q-py-none q-my-xs bg-red-4 text-white sub"
              @click="moveGame(props.row.playDate, props.row.gameNo)"
            >
              <span style="flex: 1">패배</span>
            </q-btn>
          </template>
          <template v-else>
            <q-btn
              dense
              class="q-py-none q-my-xs sub"
              @click="moveGame(props.row.playDate, props.row.gameNo)"
            >
              <span style="flex: 1">상세</span>
            </q-btn>
          </template>
        </q-td>
        <template
          v-for="stat in ['pts', 'reb', 'ast', 'tpm', 'orb', 'stl', 'blk']"
          :key="stat"
        >
          <q-td :props="props" :class="stat">
            <TableItemStatCell :contents1="props.row[stat]" />
          </q-td>
        </template>
      </q-tr>
    </template>
  </q-table>
  <ViewerPlayerVideo
    v-if="_cuts"
    v-model="videoViewerOn"
    :selectedPlayer="playerName"
    :selectedPlayerStat="getSelectedStat(selectedPlayDate, selectedGameNo)"
    :cuts="_cuts"
  />
</template>
<style lang="scss" scoped>
.sub {
  color: #777;
  text-align: left;
  font-size: 12px;
  font-weight: lighter;
}
</style>
