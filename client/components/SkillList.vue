<script setup lang="ts">
import { defaultSkill } from "../composables/constants";
</script>

<template>
  <div class="bg-dark" style="height: 100%; border-right: 0.5px solid grey">
    <q-btn
      clickable
      color="yellow"
      text-color="black"
      class="q-ma-md"
      icon-right="sports_basketball"
      style="min-height: 8px"
    >
      스킬　
    </q-btn>
    <div class="row justify-center" style="gap: 12px">
      <q-btn
        v-for="skill in defaultSkill"
        clickable
        text-color="white"
        color="black"
        class="col-2"
        padding="0px 4px"
      >
        <div>
          <div style="font-weight: 600; color: yellow">S + {{ skill.key }}</div>
          <div style="font-size: 11px">{{ skill.name || "-" }}</div>
        </div>
      </q-btn>
    </div>
  </div>
</template>
