<script setup lang="ts">
defineProps<{ playerStat: any }>();
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
const getPlayerGroupByGame = async (player: string) => {
  Notify.create("경기별 스탯을 준비중입니다!!");
};
const filter = ref("");
</script>
<template>
  <q-table
    class="player-table"
    flat
    bordered
    dense
    :columns="columns"
    :rows="playerStat"
    row-key="name"
    :filter="filter"
    :rows-per-page-options="[10]"
  >
    <template #top>
      <div class="text-center text-orange-5" style="flex: 1">
        * 정렬조건:경기많은순,경기일최근순,이름순
      </div>
      <q-input
        outlined
        dense
        debounce="300"
        v-model="filter"
        placeholder="선수 검색"
        style="width: 120px"
      >
        <template #append>
          <q-icon name="search" />
        </template>
      </q-input>
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
            <span style="margin-bottom: -4px">{{ props.row.play }} </span>
            <span style="color: #aaa; font-size: 11px">
              ({{ formatSimpletGameDate(props.row.playDate) }})
            </span>
          </div>
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
</template>
<style lang="scss">
.player-table {
  .q-btn .q-icon,
  .q-btn .q-spinner {
    font-size: 2em;
  }
  .q-table__bottom {
    font-size: 16px;
  }
}
</style>

table

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
}
</style>
