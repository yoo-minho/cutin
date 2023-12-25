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
          <q-btn dense class="q-my-none q-mx-xs q-py-none q-px-xs">
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
