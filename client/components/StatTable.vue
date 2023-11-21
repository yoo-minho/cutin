<script setup lang="ts">
defineProps<{ playerStat: any }>();
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
  //   {
  //     label: "효율",
  //     name: "kbl",
  //     field: "kbl",
  //     align: "center",
  //   },
] as any;

const videoViewerOn = ref(false);
const _highlights = ref();

const openViewer = async (player: string, record?: string) => {
  const route = useRoute();
  const [clubCode, playDate, gameNo] = String(route.params.gameCode).split("_");
  const params = {
    clubCode,
    playDate,
    gameNo,
    player,
  };
  const { data } = await useFetch("/api/highlights/player", {
    params,
  });
  const { highlights } = data.value || {};
  if (!highlights) return;

  videoViewerOn.value = true;
  if (record) {
    _highlights.value = highlights.filter((hl) =>
      isMyHighlight(hl.mainPlayer === player, hl.skill || "득점&어시", record)
    );
  } else {
    _highlights.value = highlights;
  }
};
</script>
<template>
  <q-table
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
          <div
            class="text-pre-wrap cursor-pointer"
            @click="openViewer(props.row.name)"
          >
            {{ props.row.name }}
          </div>
        </q-td>
        <q-td key="pts" :props="props">
          {{ props.row.pts }}
        </q-td>
        <q-td key="reb" :props="props">
          <div
            class="text-pre-wrap cursor-pointer"
            @click="openViewer(props.row.name, 'reb')"
          >
            {{ props.row.reb }}
          </div>
        </q-td>
        <q-td key="ast" :props="props">
          <div
            class="text-pre-wrap cursor-pointer"
            @click="openViewer(props.row.name, 'ast')"
          >
            {{ props.row.ast }}
          </div>
        </q-td>
        <q-td key="tpm" :props="props">
          {{ props.row.tpm }}
        </q-td>
        <q-td key="orb" :props="props">
          {{ props.row.orb }}
        </q-td>
        <q-td key="stl" :props="props">
          {{ props.row.stl }}
        </q-td>
        <q-td key="blk" :props="props">
          {{ props.row.blk }}
        </q-td>
        <q-td key="kbl" :props="props">
          {{ props.row.kbl }}
        </q-td>
      </q-tr>
    </template>
  </q-table>
  <q-dialog v-model="videoViewerOn">
    <q-btn flat v-close-popup round dense icon="close" class="close-btn" />
    <mini-video :highlights="_highlights" />
  </q-dialog>
</template>
<style>
@media only screen and (max-width: 767px) {
  .close-btn {
    position: absolute;
    color: white;
    font-size: 24px;
    right: 0;
    z-index: 1;
    bottom: 0;
  }
}

@media only screen and (min-width: 768px) {
  .close-btn {
    position: absolute;
    color: white;
    font-size: 24px;
    right: 0;
    z-index: 1;
    top: 0;
  }
}
</style>
