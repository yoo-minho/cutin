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
const videoViewerSrc = ref("");

const openViewer = async (player: string) => {
  const props = {
    clubCode: "gba",
    playDate: "20231104",
    gameNo: 2,
    player,
  };
  const start = performance.now();
  const { data } = await useFetch("/api/highlights/player", {
    params: props,
  });
  console.log(
    "canvas draw",
    Math.round((performance.now() - start) / 100) / 10
  );
  const { fileUrl } = data.value || {};
  if (!fileUrl) return;
  videoViewerOn.value = true;
  videoViewerSrc.value = fileUrl;
};
</script>
<template>
  <q-table
    dark
    flat
    dense
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
          {{ props.row.reb }}
        </q-td>
        <q-td key="ast" :props="props">
          {{ props.row.ast }}
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
    <mini-video :src="videoViewerSrc" />
  </q-dialog>
</template>
