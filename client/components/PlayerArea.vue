<script setup lang="ts">
const videoProps = useVideoPropsStore();
const currVideoName = toRef(videoProps.value, "videoName");

const teams = ref();

watch(
  () => currVideoName.value,
  async () => {
    const teamStore = await useTeamStore(currVideoName.value);
    teams.value = teamStore.value;
  }
);

const _addTeam = () => {
  if (!currVideoName.value) {
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
  }).onOk(async (val: string) => {
    const { error, message } = await addTeam(currVideoName.value, val);
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
      {{ videoProps.videoCode ? `'${videoProps.videoCode}'` : "" }} 이 날의 팀
      추가
    </q-btn>
    <template v-for="team in teams">
      <PlayerList
        :videoName="videoProps.videoName"
        :teamName="team.name"
        :players="team.players.filter((v:any) => !!v.name)"
      />
    </template>
  </div>
</template>
<style lang="scss" scoped></style>
