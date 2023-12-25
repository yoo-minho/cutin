<script setup lang="ts">
const props = defineProps<{ playerStat: any }>();
const columns = [
  {
    label: "선수",
    name: "name",
    field: "name",
    align: "center",
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

const filter = ref("");
const options = [
  {
    label: "경기순 (전체)",
    value: "play",
  },
  {
    label: "평균득점순 (3경기 이상)",
    value: "pts",
    type: "avg",
  },
  {
    label: "평균리바운드순 (3경기 이상)",
    value: "reb",
    type: "avg",
  },
  {
    label: "평균어시스트순 (3경기 이상)",
    value: "ast",
    type: "avg",
  },
  {
    label: "평균3점순 (3경기 이상)",
    value: "tpm",
    type: "avg",
  },
  {
    label: "평균공격리바운드순 (3경기 이상)",
    value: "orb",
    type: "avg",
  },
  {
    label: "평균스틸순 (3경기 이상)",
    value: "stl",
    type: "avg",
  },
  {
    label: "평균블록순 (3경기 이상)",
    value: "blk",
    type: "avg",
  },
];
const sort = ref(options[0]); //pts, reb, ast, tpm, orb, stl, blk
const getAvgRecord = (row: any, type: string) => {
  return String(Math.round((row[type] * 10) / row.play) / 10);
};
const getSortPlayerStat = () => {
  if (sort.value.value === "play") return props.playerStat;
  const { type, value } = sort.value;
  return [...props.playerStat]
    .filter((v) => v.play > 2)
    .sort((a: any, b: any) => {
      if (type === "avg") return +b[value] / b.play - +a[value] / a.play;
      return +b[value] - +a[value];
    });
};
const getPlayerGroupByGame = async (player: string) => {
  const route = useRoute();
  const { teamName } = route.params;
  navigateTo({
    path: `/watch/player/${player}`,
    query: { clubCode: teamName },
  });
};
</script>
<template>
  <q-table
    class="player-table"
    :class="{ [sort.value]: true }"
    flat
    bordered
    dense
    :columns="columns"
    :rows="getSortPlayerStat()"
    row-key="name"
    :filter="filter"
    :rows-per-page-options="[10]"
  >
    <template #top>
      <q-input
        outlined
        dense
        debounce="300"
        v-model="filter"
        placeholder="이름 검색"
        style="width: 120px"
      >
        <template #append>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-select
        v-model="sort"
        :options="options"
        outlined
        dense
        options-dense
        stack-label
        label="정렬필터"
      />
    </template>
    <template #body="props">
      <q-tr :props="props">
        <q-td
          key="name"
          :props="props"
          class="text-bold"
          style="font-size: 16px"
        >
          <q-btn
            dense
            class="q-py-none q-my-xs text-bold"
            @click="getPlayerGroupByGame(props.row.name)"
          >
            {{ props.row.name }}📋
          </q-btn>
        </q-td>
        <q-td key="play" :props="props" class="play">
          <TablePlayerRecordItem
            :contents1="props.row.play"
            :contents2="`(${formatSimpletGameDate(props.row.playDate)})`"
          />
        </q-td>
        <template
          v-for="stat in ['pts', 'reb', 'ast', 'tpm', 'orb', 'stl', 'blk']"
          :key="stat"
        >
          <q-td :props="props" :class="stat">
            <TablePlayerRecordItem
              :contents1="getAvgRecord(props.row, stat)"
              :contents2="props.row[stat]"
            />
          </q-td>
        </template>
      </q-tr>
    </template>
  </q-table>
</template>
<style lang="scss">
.player-table {
  .q-table__top {
    gap: 8px;
    background: #eee;
  }
  .q-btn .q-icon,
  .q-btn .q-spinner {
    font-size: 2.4em;
  }
  .q-table__bottom {
    font-size: 20px;
    background: #eee;
  }
}
</style>
<style lang="scss" scoped>
.player-table {
  td {
    padding: 0;
  }
  td:first-child {
    padding: 0 12px;
  }
  td:last-child {
    padding: 0;
  }

  &.play .play,
  &.pts .pts,
  &.reb .reb,
  &.ast .ast,
  &.tpm .tpm,
  &.orb .orb,
  &.stl .stl,
  &.blk .blk {
    color: $orange-7;
    font-weight: bold;
  }
}
</style>
