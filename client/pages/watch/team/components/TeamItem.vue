<script setup lang="ts">
const props = defineProps<{
  team: {
    name: string;
    place: string;
    cycle: string;
    method: string;
    memberCount: string;
  };
}>();
</script>
<template>
  <q-item-label class="q-mx-sm cursor-pointer">
    <q-item class="q-px-sm q-pt-sm">
      <q-item-section>
        <q-item-label class="text-weight-bolder row" style="font-size: 20px">
          <h2>{{ team.name }}</h2>
          <span class="text-grey-5 q-mx-sm">{{ team.memberCount }}</span>
        </q-item-label>
        <q-item-label> {{ team.place }}</q-item-label>
        <q-item-label> {{ team.cycle }}</q-item-label>
        <q-item-label> {{ team.method }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-item-label>
</template>

<style lang="scss" scoped></style>
