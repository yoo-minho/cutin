<script setup lang="ts">
defineProps<{
  contents1: string | number;
  contents2?: string | number;
}>();
</script>
<template>
  <q-btn dense class="q-py-none q-my-xs row">
    <div class="row dotdotdot">
      <span class="main" style="flex: 1">{{ contents1 }}</span>
      <span class="sub" style="flex: 1">{{ contents2 }}</span>
    </div>
  </q-btn>
</template>
<style lang="scss" scoped>
.dotdotdot {
  width: 100px;
  white-space: nowrap; /* 텍스트가 한 줄로 표시되도록 설정 */
  overflow: hidden; /* 컨테이너를 벗어나는 부분을 감춤 */
  text-overflow: ellipsis; /* 잘린 부분에 대해 ellipsis(...)를 표시 */
}
.main {
  margin-bottom: -10px;
  text-align: left;
  font-size: 14px;
  font-weight: bold;
}
.sub {
  color: #777;
  text-align: left;
  font-size: 12px;
  font-weight: lighter;
}
</style>
