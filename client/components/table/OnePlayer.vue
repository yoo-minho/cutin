<script setup lang="ts">
const props = defineProps<{ playerStat: any[] }>();
const columns = [
  {
    label: "게임",
    name: "gameNo",
    field: "gameNo",
    align: "center",
  },
  {
    label: "영상",
    name: "video",
    field: "video",
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
const playerStat = props.playerStat.map((v) => {
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
  videoViewerOn.value = true;
};
const getSelectedPlayerStat = (playerName: string) =>
  props.playerStat.find((v: { name: string }) => v.name === playerName) || {};

const route = useRoute();
const { playerName: _playerName } = route.params;
const playerName = String(_playerName);
const { clubCode: _clubCode } = route.query;
const clubCode = String(_clubCode);
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
        <q-td colspan="100%" style="background-color: #eee">
          📅 {{ formatGameDate(props.row.playDate) }}
        </q-td>
      </q-tr>
      <q-tr :props="props">
        <q-td key="gameNo" :props="props" class="gameNo">
          {{ props.row.gameNo }}게임
        </q-td>
        <q-td key="video" :props="props" class="video">
          <q-btn
            dense
            class="q-my-none q-mx-xs q-py-none q-px-xs"
            @click="
              openViewer({
                clubCode,
                playDate: props.row.playDate,
                gameNo: props.row.gameNo,
                playerName,
              })
            "
          >
            🏀영상
          </q-btn>
        </q-td>
        <template
          v-for="stat in ['pts', 'reb', 'ast', 'tpm', 'orb', 'stl', 'blk']"
          :key="stat"
        >
          <q-td :props="props" :class="stat">
            {{ props.row[stat] }}
          </q-td>
        </template>
      </q-tr>
    </template>
  </q-table>
  <ViewerPlayerVideo
    v-if="_cuts"
    v-model="videoViewerOn"
    :selectedPlayer="playerName"
    :selectedPlayerStat="getSelectedPlayerStat(playerName)"
    :cuts="_cuts"
  />
</template>
<style>
dd {
}
</style>
<style lang="scss">
.q-table__container {
  td {
    padding: 0;
  }
  td:first-child {
    padding: 0 12px;
  }
  td:last-child {
    padding: 0;
  }
}
</style>
