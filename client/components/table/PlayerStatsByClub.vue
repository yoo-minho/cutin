<script setup lang="ts">
defineProps<{ stats: any[] }>();

const columns = [
  {
    label: "🏀",
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
    :rows="stats"
    row-key="name"
    :rows-per-page-options="[0]"
    :hide-pagination="true"
  >
    <template #body="props">
      <q-tr :props="props">
        <q-td key="play" :props="props" class="play" style="width: 140px">
          <TableItemStatCell contents1="평균기록" />
          <div v-if="props.row[`pts_rank`]" class="rank highlight">
            팀내랭킹👑
          </div>
        </q-td>
        <template
          v-for="stat in ['pts', 'reb', 'ast', 'tpm', 'orb', 'stl', 'blk']"
          :key="stat"
        >
          <q-td :props="props" :class="stat">
            <TableItemStatCell :contents1="getAvgStat(props.row, stat)" />
            <div
              v-if="props.row[`${stat}_rank`]"
              class="rank"
              :class="{ highlight: props.row[`${stat}_rank`] <= 5 }"
            >
              {{ props.row[`${stat}_rank`] }}위
            </div>
          </q-td>
        </template>
      </q-tr>
    </template>
  </q-table>
</template>
<style lang="scss" scoped>
.rank {
  margin-top: 4px;
  color: #aaa;
  font-size: 12px;
  &.highlight {
    color: $orange-7;
    font-size: 13px;
    font-weight: bold;
  }
}
</style>
