<script setup lang="ts">
const props = defineProps<{
  vs: {
    dateInfo: string;
    aTeamName: string;
    aScore: number;
    bTeamName: string;
    bScore: number;
  };
}>();

const whoWin = props.vs.bScore > props.vs.aScore ? "b" : "a";
</script>
<template>
  <q-item-label class="q-mx-sm" :class="'cursor-pointer'" @click="">
    <q-item class="q-px-sm q-pt-sm">
      <q-item-section>
        <q-item-label>
          {{ vs.dateInfo }}
        </q-item-label>

        <q-item-label
          class="row items-center"
          style="justify-content: space-around"
        >
          <q-item-label class="teamName">{{ vs.aTeamName }}</q-item-label>
          <q-item-label class="score" :class="whoWin === 'a' ? 'win' : ''">
            {{ vs.aScore }}
          </q-item-label>
          <q-item-label class="vs">VS</q-item-label>
          <q-item-label class="score" :class="whoWin === 'b' ? 'win' : ''">
            {{ vs.bScore }}
          </q-item-label>
          <q-item-label class="teamName">{{ vs.bTeamName }}</q-item-label>
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-item-label>
</template>

<style lang="scss" scoped>
.teamName {
  font-size: 24px;
  font-weight: bold;
}
.score {
  font-size: 36px;
  font-weight: bolder;

  &.win {
    color: #ff8c00;
  }
}
</style>
