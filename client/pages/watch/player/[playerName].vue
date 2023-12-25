<script setup lang="ts">
definePageMeta({
  layout: "watch-detail",
});
const route = useRoute();
const { playerName } = route.params;
const { clubCode } = route.query;

const _stats = ref([]);
const { data: stats } = await useFetch<any>(
  `/api/club/${clubCode}/player/${playerName}`
);
watch(
  stats,
  (newData) => {
    if (!newData) return;
    _stats.value = newData;
  },
  { immediate: true }
);
</script>
<template>
  <div>
    <q-item-label class="q-mx-sm cursor-pointer q-mt-sm">
      <q-item class="q-px-sm q-pt-sm">
        <!-- <q-item-section side>
          <q-avatar rounded size="80px">
            <img src="https://cdn.quasar.dev/img/avatar.png" />
          </q-avatar>
        </q-item-section> -->
        <q-item-section>
          <q-item-label class="text-weight-bold row items-center q-mb-xs">
            <div class="playerName">{{ playerName }}</div>
          </q-item-label>
          <!-- <q-item-label class="teamInfo">
            <q-icon name="place" class="q-mr-xs" /> 포지션
          </q-item-label>
          <q-item-label class="teamInfo">
            <q-icon name="calendar_today" class="q-mr-xs" />
            키
          </q-item-label>
          <q-item-label class="teamInfo">
            <q-icon name="rule" class="q-mr-xs" />
            몸무게
          </q-item-label> -->
        </q-item-section>
      </q-item>
    </q-item-label>
  </div>
  <div class="max-width">
    <TableOnePlayer :player-stat="_stats" />
  </div>
</template>

<style lang="scss" scoped>
.playerName {
  font-size: 24px;
  line-height: 20px;
  letter-spacing: -3px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
}
</style>
