<script setup lang="ts">
const props = defineProps<{ playerStat: any }>();
const getSelectedPlayerStat = (playerName: string) =>
  props.playerStat.find((v: { name: string }) => v.name === playerName) || {};
const columns = [
  {
    label: "선수",
    name: "name",
    field: "name",
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
  // {
  //   label: "공헌",
  //   name: "kbl",
  //   field: "kbl",
  //   align: "center",
  // },
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
  const isNotReadyVideo =
    _cuts.value.filter((cut: any) => !cut.videoUrl).length > 0;
  if (isNotReadyVideo) {
    Notify.create("영상을 준비중입니다!");
    return;
  }
  selectedPlayer.value = player;
  videoViewerOn.value = true;
};
</script>
<template>
  <q-table
    class="stat-table"
    flat
    dense
    bordered
    :columns="columns"
    :rows="playerStat"
    :rows-per-page-options="[0]"
    :hide-pagination="true"
  >
    <template #body="props">
      <q-tr :props="props">
        <q-td key="name" :props="props">
          <template v-if="props.row.name === '전체'">
            {{ props.row.name }}
          </template>
          <template v-else>
            <q-btn
              dense
              icon-right="smart_display"
              class="q-ma-xs q-py-none text-pre-wrap"
              style="font-size: 13px"
              @click="openViewer(props.row.name)"
            >
              {{ props.row.name }}
            </q-btn>
          </template>
        </q-td>
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
  <ViewerPlayerVideo
    v-if="_cuts"
    v-model="videoViewerOn"
    :selectedPlayer="selectedPlayer"
    :selectedPlayerStat="getSelectedPlayerStat(selectedPlayer)"
    :cuts="_cuts"
  />
</template>
<style lang="scss" scoped>
.stat-table {
  td {
    padding: 0 !important;
  }

  .q-btn__content {
    gap: 4px;

    .q-icon {
      font-size: 1.2em;
    }
  }
}
</style>
