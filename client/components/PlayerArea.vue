<script setup lang="ts">
let teamStore = ref();
const videoProps = useVideoPropsStore();
const videoCode = toRef(videoProps.value, "videoCode");

watch(videoCode, () => (teamStore = useTeamStore()));

const _addTeam = () => {
  if (!videoCode.value) {
    Notify.create("먼저 영상을 업로드해주세요!");
    return;
  }

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
    <q-btn
      clickable
      color="pink"
      class="q-mb-md"
      icon="add"
      style="min-height: 8px"
      @click="_addTeam()"
    >
      {{ videoCode ? `'${videoCode}'` : "" }} 이 날의 팀 추가
    </q-btn>
    <template v-if="videoCode">
      <player-list
        v-for="team in teamStore"
        :teamName="team.name"
        :players="team.players"
      />
    </template>
  </div>
</template>
<style lang="scss" scoped></style>
