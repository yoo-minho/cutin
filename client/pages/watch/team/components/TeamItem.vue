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
        <q-item-label class="text-weight-bold row items-center q-mb-xs">
          <div class="teamName">
            {{ team.name }}
          </div>
        </q-item-label>
        <q-item-label class="teamInfo">
          <q-icon name="place" class="q-mr-xs" /> {{ team.place }}
        </q-item-label>
        <q-item-label class="teamInfo">
          <q-icon name="calendar_today" class="q-mr-xs" />
          {{ team.cycle }}
        </q-item-label>
        <q-item-label class="teamInfo">
          <q-icon name="rule" class="q-mr-xs" />
          {{ team.method }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-item-label>
</template>

<style lang="scss" scoped>
.teamName {
  font-size: 24px;
  line-height: 20px;
  letter-spacing: -3px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
}

.teamInfo {
  color: #999;
}
</style>
