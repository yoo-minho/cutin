<script setup lang="ts">
defineProps<{ icon: string }>();
</script>
<template>
  <q-btn :icon="icon" size="xs" :style="{ padding: '4px 8px' }" />
</template>
