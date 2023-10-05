<script setup lang="ts">
const emits = defineEmits<{ (e: "moveSeekPoint", time: string): void }>();

const videoProps = useVideoPropsStore();
const currTime = toRef(videoProps.value, "currentTime");
const currVideoName = toRef(videoProps.value, "videoName");

const currGame = useCurrGame();
const gameTab = ref("1g");
const quaterTab = ref("1q");
const tab = ref("");

let cutStore = ref<any[]>();
const currentCutStore = ref();

watch(
  [gameTab, quaterTab],
  () => {
    tab.value = gameTab.value + quaterTab.value;
    currGame.value = gameTab.value + quaterTab.value;
    currentCutStore.value = cutStore.value?.filter(
      (cut) => cut.game === currGame.value && !!cut.time
    );
  },
  { immediate: true }
);

watch(currVideoName, () => {
  cutStore = useCutStore(currVideoName.value);
  currentCutStore.value = cutStore.value?.filter(
    (cut) => cut.game === currGame.value && !!cut.time
  );
});

const downGameData = () => {
  const data = cutStore.value?.map((cut) => ({
    ...cut,
    videoName: currVideoName.value,
  }));
  const jsonString = JSON.stringify(data);
  const blob = new Blob([jsonString], { type: "application/json" });
  const blobUrl = URL.createObjectURL(blob);

  const downloadLink = document.createElement("a");
  downloadLink.href = blobUrl;
  downloadLink.download = currVideoName.value.replace(".mp4", ".json");

  downloadLink.click();
};

const columns = [
  {
    label: "time",
    name: "time",
    field: "time",
    align: "center",
    style: { width: "72px" },
  },
  {
    label: "scorer",
    name: "scorer",
    field: "scorer",
    align: "center",
    style: { width: "30%" },
  },
  {
    label: "assister",
    name: "assister",
    field: "assister",
    align: "center",
    style: { width: "30%" },
  },
  {
    label: "skill",
    name: "skill",
    field: "skill",
    align: "center",
    style: { width: "30%" },
  },
] as any;
</script>
<template>
  <div class="bg-dark" style="height: 100%; border-left: 0.5px solid grey">
    <q-btn
      color="green"
      text-color="white"
      class="q-ma-md"
      icon-right="file_download"
      @click="downGameData"
    >
      게임 데이터 JSON 내려받기
    </q-btn>
    <q-separator color="grey-7" size="0.5px" />
    <q-tabs
      v-model="gameTab"
      dense
      class="text-grey"
      active-color="white"
      align="left"
    >
      <q-tab name="1g" label="1게임" />
      <q-tab name="2g" label="2게임" />
      <q-tab name="3g" label="3게임" />
      <q-tab name="4g" label="4게임" />
    </q-tabs>
    <q-tabs
      v-model="quaterTab"
      dense
      class="text-grey"
      active-color="white"
      align="left"
    >
      <q-tab name="1q" label="1쿼터" />
      <q-tab name="2q" label="2쿼터" />
      <q-tab name="3q" label="3쿼터" />
      <q-tab name="4q" label="4쿼터" />
    </q-tabs>
    <q-separator color="grey-7" size="1px" />
    <q-table
      dark
      flat
      dense
      :columns="columns"
      :rows="currentCutStore"
      :hide-pagination="true"
    >
      <template #no-data>
        <div class="full-width row flex-center text-green q-gutter-sm">
          <q-icon size="2em" name="sports_basketball" />
          <span> 'C' 단축키를 눌러 득점 순간을 기록하세요! </span>
        </div>
      </template>

      <template #body="props">
        <q-tr
          :props="props"
          :class="props.row.time === currTime ? 'text-green' : ''"
        >
          <q-td key="time" :props="props">
            <div
              class="text-pre-wrap cursor-pointer"
              @click="emits('moveSeekPoint', String(props.row.time))"
            >
              {{ props.row.time }}
            </div>
          </q-td>
          <q-td key="scorer" :props="props">{{ props.row.scorer }} </q-td>
          <q-td key="assister" :props="props">
            {{ props.row.assister }}
          </q-td>
          <q-td key="skill" :props="props">{{ props.row.skill }}</q-td>
        </q-tr>
      </template>
    </q-table>
    <q-separator color="grey-7" size="0.5px" />
  </div>
</template>
<style scoped>
.q-table__container {
  border-radius: 0;
}
</style>
