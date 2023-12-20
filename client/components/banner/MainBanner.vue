<script setup lang="ts">
const slide = ref("first");
</script>
<template>
  <div>
    <q-carousel
      arrows
      animated
      v-model="slide"
      height="140px"
      style="cursor: pointer"
    >
      <q-carousel-slide name="first" img-src="/assets/img/basketball-court.jpg">
        <div class="absolute-bottom custom-caption">
          <div class="text-h5">프롤로그</div>
          <div class="text-subtitle2">만든 이의 이야기가 궁금하다면 Click</div>
        </div>
      </q-carousel-slide>
      <q-carousel-slide name="second" img-src="/assets/img/basketball.jpg">
        <div class="absolute-bottom custom-caption">
          <div class="text-h5">업데이트노트</div>
          <div class="text-subtitle2">업데이트되는 기능이 궁금하다면 Click</div>
        </div>
      </q-carousel-slide>
    </q-carousel>
  </div>
</template>
<style lang="scss" scoped>
.custom-caption {
  text-align: center;
  padding: 12px;
  color: white;
  background-color: rgba(0, 0, 0, 0.3);
}
</style>
