<script setup lang="ts">
defineProps<{ command?: string; label: string; color?: string }>();
</script>
<template>
  <q-chip
    outline
    square
    :color="color || 'white'"
    style="letter-spacing: -2px; height: auto"
    class="q-pa-xs"
  >
    <div class="column">
      <div v-if="command" class="key">
        <div class="keycap" :style="{ color: color || 'black' }">
          {{ command }}
        </div>
      </div>
      <div class="text-center">{{ label }}</div>
    </div>
  </q-chip>
</template>
<style scoped>
.key {
  width: 46px;
  height: 46px;
  border-width: 3px 7px 10px;
  border-style: solid;
  border-radius: 4px;
  /* scale: 0.8; */
}
.key.pressed {
  -webkit-transform: scale(0.95, 0.95);
  -moz-transform: scale(0.95, 0.95);
  -ms-transform: scale(0.95, 0.95);
  -o-transform: scale(0.95, 0.95);
  transform: scale(0.95, 0.95);
}

.key {
  background: #d3cfcc;
  border-color: #ece8e4 #dedad6 #c9c4c4;
}

.key .keycap {
  width: 33px;
  height: 33px;
  padding: 5px 0 0 7px;
  font-size: 16px;
  line-height: 1;
  background: #f5f3f1;
  background: -webkit-linear-gradient(left, #e5e2e1, #f5f3f1, #e5e2e1);
  background: -moz-linear-gradient(left, #e5e2e1, #f5f3f1, #e5e2e1);
  background: -ms-linear-gradient(left, #e5e2e1, #f5f3f1, #e5e2e1);
  background: -o-linear-gradient(left, #e5e2e1, #f5f3f1, #e5e2e1);
  background: linear-gradient(to right, #e5e2e1, #f5f3f1, #e5e2e1);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  position: relative;
}
</style>
