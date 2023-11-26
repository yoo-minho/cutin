<script setup lang="ts">
import type { VsType } from "@/types";

const props = defineProps<{ vs: VsType }>();

const { score: aScore, teamName: aTeamName } = props.vs.match[0];
const { score: bScore, teamName: bTeamName } = props.vs.match[1];

const whoWin = bScore > aScore ? "b" : "a";
</script>
<template>
  <q-item-label class="q-mx-sm" :class="'cursor-pointer'" @click="">
    <q-item class="q-px-sm q-pt-sm">
      <q-item-section>
        <q-item-label>
          <q-icon name="event" class="q-mr-xs" />
          {{ vs.dateInfo }}
        </q-item-label>

        <q-item-label
          class="row items-center"
          style="justify-content: space-around"
        >
          <q-item-label class="teamName">{{ aTeamName }}</q-item-label>
          <q-item-label class="score" :class="whoWin === 'a' ? 'win' : ''">
            {{ aScore }}
          </q-item-label>
          <q-item-label class="vs">VS</q-item-label>
          <q-item-label class="score" :class="whoWin === 'b' ? 'win' : ''">
            {{ bScore }}
          </q-item-label>
          <q-item-label class="teamName">{{ bTeamName }}</q-item-label>
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

.vs {
  font-size: 24px;
}
.score {
  font-size: 36px;
  font-weight: bolder;

  &.win {
    color: #ff8c00;
  }
}
</style>
