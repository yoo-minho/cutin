<script setup lang="ts">
const skillStore = useSkillStore();
</script>

<template>
  <div class="row items-center">
    <q-chip
      clickable
      square
      color="green"
      class="q-px-sm"
      style="font-size: 13px"
    >
      스킬
    </q-chip>
    <q-chip
      v-for="skill in skillStore"
      clickable
      outline
      square
      color="white"
      class="q-px-sm"
      style="font-size: 13px"
    >
      {{ skill.name }}
    </q-chip>
  </div>
</template>
