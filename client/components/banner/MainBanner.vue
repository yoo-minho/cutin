<script setup lang="ts">
const slide = ref("first");
</script>
<template>
  <div class="q-pa-sm">
    <q-carousel
      swipeable
      arrows
      animated
      v-model="slide"
      height="140px"
      style="cursor: pointer"
      class="rounded-borders"
      control-color="orange-7"
    >
      <q-carousel-slide
        name="first"
        img-src="/assets/img/doyoulike.jpg"
        @click="navigateTo('/blog/story')"
        class="q-pa-none"
      >
        <div class="wrap">
          <div class="contents">
            <div
              class="text-h6 text-bold text-center"
              style="margin-bottom: -8px"
            >
              Story
            </div>
            <div class="text-subtitle2">
              만든 이의 이야기가 궁금하다면 <b class="click-text">Click</b>
            </div>
          </div>
        </div>
      </q-carousel-slide>
      <q-carousel-slide
        name="second"
        img-src="/assets/img/basketball.jpg"
        @click="navigateTo('/blog/manual')"
        class="q-pa-none"
      >
        <div class="wrap">
          <div class="contents">
            <div
              class="text-h6 text-bold text-center"
              style="margin-bottom: -8px"
            >
              Manual
            </div>
            <div class="text-subtitle2">
              스탯 매뉴얼이 궁금하다면 <b class="click-text">Click</b>
            </div>
          </div>
        </div>
      </q-carousel-slide>
    </q-carousel>
  </div>
</template>
<style lang="scss" scoped>
.wrap {
  display: flex;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  height: 100%;
  align-items: flex-end;
  justify-content: center;
  .contents {
    margin-bottom: 8px;
  }
  .click-text {
    color: $orange-7;
  }
}
</style>
