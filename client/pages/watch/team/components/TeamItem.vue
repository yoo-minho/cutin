<script setup lang="ts">
defineProps<{
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
  <q-item-label class="q-mx-sm cursor-pointer q-mt-sm">
    <q-item class="q-px-sm q-pt-sm">
      <q-item-section>
        <q-item-label class="text-weight-bold row items-center">
          <h2>{{ team.name }}</h2>
          <span class="text-grey-5 q-mx-sm">{{ team.memberCount }}</span>
        </q-item-label>
        <q-item-label
          ><q-icon name="place" class="q-mr-xs" /> {{ team.place }}
        </q-item-label>
        <q-item-label
          ><q-icon name="calendar_today" class="q-mr-xs" />
          {{ team.cycle }}
        </q-item-label>
        <q-item-label
          ><q-icon name="rule" class="q-mr-xs" />
          {{ team.method }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-item-label>
</template>

<style lang="scss" scoped></style>
