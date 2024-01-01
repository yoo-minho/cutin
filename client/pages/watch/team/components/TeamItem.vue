<script setup lang="ts">
import type { TeamInfoType } from "@/types";

defineProps<{ team: TeamInfoType }>();
</script>
<template>
  <q-item-label class="q-mx-sm cursor-pointer q-mt-sm">
    <q-item class="q-px-sm q-pt-sm">
      <q-item-section>
        <q-item-label class="text-weight-bold row items-center q-mb-xs">
          <div class="teamName">{{ team.name }}</div>
        </q-item-label>
        <q-item-label class="teamInfo">
          🏟️ 장소 : {{ team.place }}
        </q-item-label>
        <q-item-label class="teamInfo">
          🏆 방식 : {{ team.method }}
        </q-item-label>
        <q-item-label class="teamInfo">
          🔄 주기 : {{ team.cycle }}
        </q-item-label>
        <q-item-label class="teamInfo">
          📅 최근 : {{ formatGameDate(team.lastPlayDate) }}
        </q-item-label>
        <q-item-label class="teamInfo">
          👤 멤버 : {{ team.memberCount }}명 (게스트 : {{ team.guestCount }}명)
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-item-label>
</template>

<style lang="scss" scoped>
.teamName {
  font-size: 24px;
  line-height: 20px;
  letter-spacing: -3px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
}

.teamInfo {
  color: #999;
}
</style>
