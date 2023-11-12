<script setup lang="ts">
const props = defineProps<{ type: "DETAIL" | "MAIN"; title: string }>();
const emits = defineEmits<{ (e: "backEvent"): void }>();
</script>
<template>
  <q-header bordered class="max-width">
    <q-toolbar>
      <q-btn
        v-if="type === 'DETAIL'"
        area-label="back"
        icon="keyboard_backspace"
        flat
        round
        dense
        @click="emits('backEvent')"
      />
      <q-toolbar-title class="name">
        <h1>{{ title }}</h1>
      </q-toolbar-title>
      <q-btn
        area-label="shareBottomSheet"
        icon="share"
        flat
        round
        dense
        @click=""
      />
    </q-toolbar>
  </q-header>
</template>

<style lang="scss" scoped>
.name {
  align-items: center;
  font-size: 20px;
  margin-left: 4px;
  font-weight: bold;
}
</style>
