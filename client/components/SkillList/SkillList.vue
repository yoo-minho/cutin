<script setup lang="ts">
const skillStore = useSkillStore();
</script>
<template>
  <div class="row items-center">
    <q-chip
      outline
      square
      color="white"
      class="q-px-sm"
      style="letter-spacing: -2px; height: auto; width: 70px"
    >
      <div class="column">
        <div class="key">
          <div class="keycap text-dark">A</div>
        </div>
        <div class="text-center">어시스트</div>
      </div>
    </q-chip>

    <q-icon name="add" class="text-white"></q-icon>

    <q-chip
      outline
      square
      color="orange"
      style="letter-spacing: -2px; height: auto"
    >
      <div class="column">
        <div class="key">
          <div class="keycap">?</div>
        </div>
        <div class="text-center">선수단축키</div>
      </div>
    </q-chip>
  </div>
  <div class="row items-center">
    <q-chip
      outline
      square
      color="white"
      class="q-px-sm"
      style="letter-spacing: -2px; height: auto; width: 70px"
    >
      <div class="column">
        <div class="key">
          <div class="keycap text-dark">S</div>
        </div>
        <div class="text-center">스킬</div>
      </div>
    </q-chip>

    <q-icon name="add" class="text-white"></q-icon>

    <q-chip
      v-for="(skill, idx) in skillStore"
      outline
      square
      color="green"
      class="q-px-sm"
      style="letter-spacing: -2px; height: auto"
    >
      <div class="column">
        <div class="key">
          <div class="keycap">{{ keySet.first[idx] }}</div>
        </div>
        <div class="text-center">{{ skill.name }}</div>
      </div>
    </q-chip>
  </div>
</template>
<style lang="scss" scoped>
.key {
  width: 46px;
  height: 46px;
  border-width: 3px 7px 10px;
  border-style: solid;
  border-radius: 4px;
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
