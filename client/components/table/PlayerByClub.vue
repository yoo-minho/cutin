<script setup lang="ts">
const props = defineProps<{ playerStat: any }>();
const getSelectedPlayerStat = (playerName: string) =>
  props.playerStat.find((v: { name: string }) => v.name === playerName) || {};
const columns = [
  {
    label: "선수",
    name: "name",
    align: "center",
    field: (row) => row.name,
  },
  {
    label: "경기",
    name: "play",
    field: "play",
    align: "center",
  },
  {
    label: "최근경기일자",
    name: "playDate",
    field: "playDate",
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

const videoViewerOn = ref(false);
const _cuts = ref();
const selectedPlayer = ref("");

const openViewer = async (player: string) => {
  if (player === "전체") return;
  const route = useRoute();
  const [clubCode, playDate, gameNo] = String(route.params.gameCode).split("_");
  const allGameCuts = await fetchAllGameCut({ clubCode, playDate, gameNo }); //매번 불러오는 비효율
  _cuts.value = allGameCuts.filter(
    (cut) => cut.mainPlayer === player || cut.subPlayer === player
  );
  selectedPlayer.value = player;
  videoViewerOn.value = true;
};
</script>
<template>
  <div class="text-center q-mt-md">
    * 정렬조건 : 경기수 내림차순, 최근경기일 내림차순, 이름순
  </div>
  <q-table
    title="평균 기록"
    class="my-sticky-header-column-table max-width"
    flat
    bordered
    dense
    :columns="columns"
    :rows="playerStat"
    :rows-per-page-options="[0]"
    :hide-pagination="true"
    row-key="name"
  >
    <template #body="props">
      <q-tr :props="props">
        <q-td key="name" :props="props">{{ props.row.name }}</q-td>
        <q-td key="play" :props="props"> {{ props.row.play }} </q-td>
        <q-td key="playDate" :props="props"> {{ props.row.playDate }} </q-td>
        <q-td key="pts" :props="props"> {{ props.row.pts }} </q-td>
        <q-td key="reb" :props="props"> {{ props.row.reb }} </q-td>
        <q-td key="ast" :props="props"> {{ props.row.ast }} </q-td>
        <q-td key="tpm" :props="props"> {{ props.row.tpm }} </q-td>
        <q-td key="orb" :props="props"> {{ props.row.orb }} </q-td>
        <q-td key="stl" :props="props"> {{ props.row.stl }} </q-td>
        <q-td key="blk" :props="props"> {{ props.row.blk }} </q-td>
        <q-td key="kbl" :props="props"> {{ props.row.kbl }} </q-td>
      </q-tr>
    </template>
  </q-table>
</template>
<style lang="sass">
.my-sticky-header-column-table
  height: 600px

  td:first-child
    background-color: $orange-5

  tr th
    position: sticky
    z-index: 2
    background: $orange-5

  thead tr:last-child th
    top: 48px
    z-index: 3
  thead tr:first-child th
    top: 0
    z-index: 1
  tr:first-child th:first-child
    z-index: 3

  td:first-child
    z-index: 1
    padding: 0 12px !important
    border-bottom-width : 0 !important

  td:first-child, th:first-child
    position: sticky
    left: 0

  tbody
    scroll-margin-top: 48px
</style>
