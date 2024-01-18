<script setup lang="ts">
import type { TeamInfoType } from "@/types";

const route = useRoute();
const { playerName: _playerName } = route.params;
const playerName = String(_playerName);

const { data: clubs } = await useFetch<TeamInfoType[]>(`/api/club`);

const _stats = ref([]);
const { data: stats } = await useFetch<any>(`/api/player/${playerName}/club`);
watch(
  stats,
  (newData) => {
    if (!newData) return;
    _stats.value = newData;
  },
  { immediate: true }
);

const columns = [
  {
    label: "팀",
    name: "clubCode",
    field: "clubCode",
    align: "left",
  },
  {
    label: "경기",
    name: "play",
    field: "play",
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
</script>
<template>
  <q-table
    flat
    bordered
    dense
    :columns="columns"
    :rows="_stats"
    row-key="name"
    :rows-per-page-options="[0]"
    :hide-pagination="true"
  >
    <template #body="props">
      <q-tr :props="props">
        <q-td key="clubCode" :props="props" class="clubCode">
          <TableItemConnectVBtn
            :contents1="String(clubs)"
            contents2="팀 상세보기"
          />
        </q-td>
        <q-td key="play" :props="props" class="play">
          <TableItemStatCell
            :contents1="props.row.play"
            :contents2="`(${formatSimpletGameDate(props.row.playDate)})`"
          />
        </q-td>
        <template
          v-for="stat in ['pts', 'reb', 'ast', 'tpm', 'orb', 'stl', 'blk']"
          :key="stat"
        >
          <q-td :props="props" :class="stat">
            <TableItemStatCell
              :contents1="getAvgStat(props.row, stat)"
              :contents2="props.row[stat]"
            />
          </q-td>
        </template>
      </q-tr>
    </template>
  </q-table>
</template>
