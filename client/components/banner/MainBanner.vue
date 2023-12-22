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
      <q-carousel-slide
        name="first"
        img-src="/assets/img/doyoulike.jpg"
        @click="navigateTo('/blog/story')"
        class="q-pa-none"
      >
        <div class="custom-caption">
          <div class="text-h6"></div>
          <div class="text-subtitle2">만든 이의 이야기가 궁금하다면 Click</div>
        </div>
      </q-carousel-slide>
      <!-- <q-carousel-slide name="second" img-src="/assets/img/basketball.jpg">
        <div class="absolute-bottom custom-caption">
          <div class="text-h5">업데이트노트</div>
          <div class="text-subtitle2">업데이트되는 기능이 궁금하다면 Click</div>
        </div>
      </q-carousel-slide> -->
    </q-carousel>
  </div>
</template>
<style lang="scss" scoped>
.custom-caption {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  text-align: center;
  color: white;
  padding: 0;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
