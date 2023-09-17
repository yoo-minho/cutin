<script setup lang="ts">
const skillStore = useSkillStore();
</script>

<template>
  <div class="row items-center">
    <KeyCap command="A" label="어시스트" style="width: 80px" />
    <q-icon name="add" class="text-white"></q-icon>
    <KeyCap command="?" label="선수단축키" color="orange" />
  </div>
  <div class="row items-center">
    <KeyCap command="S" label="스킬" style="width: 80px" />
    <q-icon name="add" class="text-white"></q-icon>
    <KeyCap
      v-for="(skill, idx) in skillStore"
      :command="keySet.first[idx]"
      :label="skill.name"
      color="green"
    />
  </div>
</template>
