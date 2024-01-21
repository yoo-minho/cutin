<script setup lang="ts">
const videoStore = useVideoStore();
const teams = ref();
const videoName = ref("");
const videoCode = ref("");

watch(
  () => videoStore.value.videoElems?.[0]?.videoName,
  async (name) => {
    if (!name) return;
    videoName.value = name;
    const [clubCode, playDate] = name.split("_");
    videoCode.value = clubCode + playDate;
    const teamStore = await useTeamStore(name);
    watch(teamStore, () => (teams.value = teamStore.value), {
      immediate: true,
    });
  }
);

const _addTeam = () => {
  if (!videoCode.value) {
    Notify.create("먼저 영상을 업로드해주세요!");
    return;
  }

  Dialog.create({
    title: "팀 추가",
    prompt: { type: "text" },
    ok: "추가",
    cancel: "취소",
  }).onOk(async (teamName: string) => {
    const { error, message } = await addTeam(videoName.value, teamName);
    if (error) Notify.create({ type: "negative", message });
  });
};

const _addPlayer = (teamName: string) => {
  Dialog.create({
    title: "선수 추가",
    message:
      "1. 가나다 순으로 추가됩니다! <br>2. ','컴마로 여러명 추가 가능합니다.",
    html: true,
    prompt: {
      type: "text",
    },
    ok: "추가",
    cancel: "취소",
  }).onOk((val: string) => {
    addPlayerOnTeam(videoName.value, teamName, val);
  });
};

const _removeTeam = (teamName: string) => {
  Dialog.create({
    title: "팀 삭제",
    ok: "제거",
    cancel: "취소",
  }).onOk(async () => {
    const { error, message } = await removeTeam(videoName.value, teamName);
    if (error) Notify.create({ type: "negative", message });
  });
};

const getShortKey = (teamIdx: number, playerIdx: number) => {
  if (teamIdx === 0) return keySet.first[playerIdx];
  return keySet.second[playerIdx];
};
</script>
<template>
  <div class="bg-dark row" style="height: 100%">
    <q-btn
      clickable
      color="white"
      text-color="black"
      class="q-ma-md"
      @click="_addTeam()"
    >
      팀<br />
      추<br />
      가<br />
      ➕
    </q-btn>
    <div class="q-my-md">
      <template v-for="(team, teamIdx) in teams">
        <div class="row q-mb-md">
          <q-btn-dropdown
            :label="`${team.name} 팀`"
            color="orange-9"
            padding="0"
            style="width: 120px"
          >
            <q-list>
              <q-item clickable v-close-popup @click="_addPlayer(team.name)">
                <q-item-section>선수 추가</q-item-section>
                <q-item-section side>
                  <q-icon name="add" />
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="_removeTeam(team.name)">
                <q-item-section>팀 삭제</q-item-section>
                <q-item-section side>
                  <q-icon name="delete" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <div class="row" style="gap: 8px; margin: 0 8px; font-size: 6px">
            <template
              v-for="(player, playerIdx) in team.players?.filter((v:any) => !!v.name) || []"
            >
              <EditorPlayerZoneItem
                :playerName="player.name"
                :teamName="team.name"
                :videoName="videoName"
                :shortKey="getShortKey(teamIdx, playerIdx)"
              />
            </template>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
