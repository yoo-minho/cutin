<script setup lang="ts">
const props = defineProps<{ playerStat: any; guest?: boolean }>();
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
let options = [
  {
    label: "누적경기순",
    value: "play",
  },
  {
    label: "평균득점순",
    value: "pts",
    type: "avg",
  },
  {
    label: "평균리바순",
    value: "reb",
    type: "avg",
  },
  {
    label: "평균어시스트순",
    value: "ast",
    type: "avg",
  },
  {
    label: "평균3점순",
    value: "tpm",
    type: "avg",
  },
  {
    label: "평균공격리바순",
    value: "orb",
    type: "avg",
  },
  {
    label: "평균스틸순",
    value: "stl",
    type: "avg",
  },
  {
    label: "평균블록순",
    value: "blk",
    type: "avg",
  },
];
if (props.guest) {
  options = [
    {
      label: "최근경기순",
      value: "playDate",
    },
    ...options,
  ];
}

const sort = ref(options[0]); //pts, reb, ast, tpm, orb, stl, blk
const getSortPlayerStat = () => {
  if (sort.value.value === "playDate") {
    return [...props.playerStat].sort((a: any, b: any) => {
      return b.playDate - a.playDate;
    });
  }
  if (sort.value.value === "play") return props.playerStat;
  const { type, value } = sort.value;
  return [...props.playerStat]
    .filter((v) => (props.guest ? true : v.play >= 4))
    .sort((a: any, b: any) => {
      if (type === "avg")
        return +getAvgStat(b, value, true) - +getAvgStat(a, value, true);
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
    class="player-table my-sticky-header-column-table"
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
    <template #no-data>
      <div>
        <span> 기록이 존재하지 않습니다 🏀 </span>
      </div>
    </template>
    <template #top>
      <div class="row q-gutter-md">
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
        />
      </div>
    </template>
    <template #body="props">
      <q-tr :props="props">
        <q-td key="name" :props="props" class="text-bold">
          <TableItemConnectVBtn
            :contents1="props.row.name"
            contents2="상세보기"
            @click="getPlayerGroupByGame(props.row.name)"
          />
        </q-td>
        <q-td key="play" :props="props" class="play playDate">
          <TableItemStatCell
            style="width: 36px"
            :contents1="props.row.play"
            :contents2="`${formatSimpletGameDate(props.row.playDate)}`"
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
<style lang="sass">
.my-sticky-header-column-table
  height: 100%
  max-width: 600px

  td:first-child
    background-color: #fff

  tr th
    position: sticky
    z-index: 2
    background: #eee

  thead tr:last-child th
    top: 48px
    z-index: 3

  thead tr:first-child th
    top: 0
    z-index: 1

  tr:first-child th:first-child
    z-index: 3
    padding: 0 8px !important

  td:first-child
    z-index: 1
    padding: 0 8px !important

  td:first-child, th:first-child
    position: sticky
    left: 0

  tbody
    scroll-margin-top: 48px
</style>
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
  .q-table__top {
    border: rgba(0, 0, 0, 0.12);
  }
  &.playDate .playDate,
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
