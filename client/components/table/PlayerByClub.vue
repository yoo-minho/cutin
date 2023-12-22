<script setup lang="ts">
const props = defineProps<{ playerStat: any }>();
const columns = [
  {
    label: "선수",
    name: "name",
    align: "center",
    field: (row: { name: any }) => row.name,
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
    label: "경기 순위 (전체)",
    value: "play",
  },
  {
    label: "득점 순위 (3경기 이상)",
    value: "pts",
  },
  {
    label: "리바운드 순위 (3경기 이상)",
    value: "reb",
  },
  {
    label: "어시스트 순위 (3경기 이상)",
    value: "ast",
  },
  {
    label: "3점슛 순위 (3경기 이상)",
    value: "tpm",
  },
  {
    label: "공격 리바운드 순위 (3경기 이상)",
    value: "orb",
  },
  {
    label: "스틸 순위 (3경기 이상)",
    value: "stl",
  },
  {
    label: "블록 순위 (3경기 이상)",
    value: "blk",
  },
];
const sort = ref(options[0]); //pts, reb, ast, tpm, orb, stl, blk
const getSortPlayerStat = () => {
  if (sort.value.value === "play") return props.playerStat;
  return [...props.playerStat]
    .filter((v) => v.play > 2)
    .sort((a: any, b: any) => b[sort.value.value] - a[sort.value.value]);
};
const getPlayerGroupByGame = async (player: string) => {
  Notify.create("경기별 스탯을 준비중입니다!!");
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
        <q-td key="play" :props="props">
          <div class="column justify-center">
            <span class="play" style="margin-bottom: -4px">
              {{ props.row.play }}
            </span>
            <span style="color: #aaa; font-size: 11px">
              ({{ formatSimpletGameDate(props.row.playDate) }})
            </span>
          </div>
        </q-td>
        <q-td key="pts" :props="props" class="pts"> {{ props.row.pts }} </q-td>
        <q-td key="reb" :props="props" class="reb"> {{ props.row.reb }} </q-td>
        <q-td key="ast" :props="props" class="ast"> {{ props.row.ast }} </q-td>
        <q-td key="tpm" :props="props" class="tpm"> {{ props.row.tpm }} </q-td>
        <q-td key="orb" :props="props" class="orb"> {{ props.row.orb }} </q-td>
        <q-td key="stl" :props="props" class="stl"> {{ props.row.stl }} </q-td>
        <q-td key="blk" :props="props" class="blk"> {{ props.row.blk }} </q-td>
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
