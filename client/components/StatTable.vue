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
const selectedPlayer = ref("");
const selectedRecord = ref("");

const openViewer = async (player: string, record?: string) => {
  if (player === "전체") return;
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
  selectedPlayer.value = player;
  selectedRecord.value = record || "";
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
          <div
            class="text-pre-wrap cursor-pointer"
            @click="openViewer(props.row.name, 'pts')"
          >
            {{ props.row.pts }}
          </div>
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
          <div
            class="text-pre-wrap cursor-pointer"
            @click="openViewer(props.row.name, 'tpm')"
          >
            {{ props.row.tpm }}
          </div>
        </q-td>
        <q-td key="orb" :props="props">
          <div
            class="text-pre-wrap cursor-pointer"
            @click="openViewer(props.row.name, 'orb')"
          >
            {{ props.row.orb }}
          </div>
        </q-td>
        <q-td key="stl" :props="props">
          <div
            class="text-pre-wrap cursor-pointer"
            @click="openViewer(props.row.name, 'stl')"
          >
            {{ props.row.stl }}
          </div>
        </q-td>
        <q-td key="blk" :props="props">
          <div
            class="text-pre-wrap cursor-pointer"
            @click="openViewer(props.row.name, 'blk')"
          >
            {{ props.row.blk }}
          </div>
        </q-td>
        <q-td key="kbl" :props="props">
          {{ props.row.kbl }}
        </q-td>
      </q-tr>
    </template>
  </q-table>
  <mini-video
    v-model="videoViewerOn"
    :selectedPlayer="selectedPlayer"
    :selectedRecord="selectedRecord"
    :highlights="_highlights"
  />
</template>
<style>
.a {
}
</style>
