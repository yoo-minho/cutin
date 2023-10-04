<script setup lang="ts">
const props = defineProps<{ videoOn: boolean }>();
let teamStore = useTeamStore();

watch(
  () => props.videoOn,
  () => {
    teamStore = useTeamStore();
  },
  { immediate: true }
);

const _addTeam = () => {
  Dialog.create({
    title: "팀 추가",
    prompt: {
      type: "text", // optional
    },
    ok: "추가",
    cancel: "취소",
  }).onOk((val: string) => {
    const { error, message } = addTeam(val);
    if (error) {
      Notify.create({ type: "negative", message });
    }
  });
};
</script>
<template>
  <div class="col bg-dark q-pa-md" style="gap: 24px">
    <template v-if="videoOn">
      <q-btn
        clickable
        color="pink"
        class="q-mb-md"
        icon="add"
        style="min-height: 8px; width: 120px"
        @click="_addTeam()"
      >
        팀 추가
      </q-btn>
      <player-list
        v-for="team in teamStore"
        :teamName="team.name"
        :players="team.players"
      />
    </template>
    <template v-else>
      <div class="text-white q-mb-md">비디오를 업로드해주세요!</div>
    </template>
  </div>
</template>
<style lang="scss" scoped></style>
