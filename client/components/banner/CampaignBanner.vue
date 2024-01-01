<template>
  <div class="q-pa-sm">
    <q-list bordered dense>
      <q-item @click="navigateTo('/blog/story')" clickable>
        <q-item-section>
          <div><b>[공지]</b> 💡 왜 만들게 되었나요?</div></q-item-section
        >
        <q-item-section side>
          <q-item-label caption class="text-orange-6">Click</q-item-label>
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item @click="navigateTo('/blog/manual')" clickable>
        <q-item-section>
          <div><b>[공지]</b> 🏀 FIBA 통계 매뉴얼을 정리해보았어요!</div>
        </q-item-section>
        <q-item-section side>
          <q-item-label caption class="text-orange-6">Click</q-item-label>
        </q-item-section>
      </q-item>
      <q-item @click="navigateTo('/blog/update')" clickable>
        <q-item-section>
          <div><b>[공지]</b> 🚀 업데이트 완료! (23.01.01)</div>
        </q-item-section>
        <q-item-section side>
          <q-item-label caption class="text-orange-6">Click</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
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
}
</style>
