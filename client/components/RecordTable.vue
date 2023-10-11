<script setup lang="ts">
const emits = defineEmits<{ (e: "moveSeekPoint", time: string): void }>();

const videoProps = useVideoPropsStore();
const currTime = toRef(videoProps.value, "currentTime");
const currVideoName = toRef(videoProps.value, "videoName");

const gameTab = ref("1");
const quaterTab = ref("1");
const currGame = useCurrGame();

let cutStore = ref<any[]>();

watch([gameTab, quaterTab], () => {
  currGame.value = gameTab.value + "g" + quaterTab.value + "q";
});

watch(currVideoName, () => {
  cutStore = useCutStore(currVideoName.value);
  const temp = gameTab.value;
  gameTab.value = "";
  gameTab.value = temp;
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

const filterMethod = (rows: readonly any[]) => {
  return rows?.filter(
    (row) =>
      row.gameNo === +gameTab.value &&
      row.quaterNo === +quaterTab.value &&
      !!row.seekTime
  );
};

const clickDownOrViewer = async (isViewer: boolean, seekTime: string) => {
  emits("moveSeekPoint", seekTime);
  await delay(0.3);
  updateCut("videoUrl", "loading");
  if (isViewer) {
    //padd
  } else {
    await getUrl3(
      videoProps.value.videoUrl,
      videoProps.value.videoSize,
      time2sec(seekTime)
    );
  }
  updateCut("videoUrl", "fileUrl");
};

const columns = [
  {
    label: "seekTime",
    name: "seekTime",
    field: "seekTime",
    align: "center",
    style: { width: "72px" },
  },
  {
    label: "skill",
    name: "skill",
    field: "skill",
    align: "center",
    style: { width: "40%" },
  },
  {
    label: "mainPlayer",
    name: "mainPlayer",
    field: "mainPlayer",
    align: "center",
    style: { width: "30%" },
  },
  {
    label: "subPlayer",
    name: "subPlayer",
    field: "subPlayer",
    align: "center",
    style: { width: "30%" },
  },
  {
    label: "컷",
    name: "videoUrl",
    field: "videoUrl",
    align: "center",
    style: { width: "16px" },
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
      <q-tab name="1" label="1게임" />
      <q-tab name="2" label="2게임" />
      <q-tab name="3" label="3게임" />
      <q-tab name="4" label="4게임" />
    </q-tabs>
    <q-tabs
      v-model="quaterTab"
      dense
      class="text-grey"
      active-color="white"
      align="left"
    >
      <q-tab name="1" label="1쿼터" />
      <q-tab name="2" label="2쿼터" />
      <q-tab name="3" label="3쿼터" />
      <q-tab name="4" label="4쿼터" />
    </q-tabs>
    <q-separator color="grey-7" size="1px" />
    <q-table
      dark
      flat
      dense
      :columns="columns"
      :rows="cutStore"
      :filter="[gameTab, quaterTab]"
      :filter-method="filterMethod"
      :rows-per-page-options="[0]"
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
          :class="props.row.seekTime === currTime ? 'text-green' : ''"
        >
          <q-td key="seekTime" :props="props">
            <div
              class="text-pre-wrap cursor-pointer"
              @click="emits('moveSeekPoint', String(props.row.seekTime))"
            >
              {{ props.row.seekTime }}
            </div>
          </q-td>
          <q-td key="skill" :props="props">{{
            props.row.skill || "득점&어시"
          }}</q-td>
          <q-td key="mainPlayer" :props="props">
            {{ props.row.mainPlayer }}
          </q-td>
          <q-td key="subPlayer" :props="props">
            {{ props.row.subPlayer }}
          </q-td>
          <q-td key="videoUrl" :props="props">
            <q-btn
              :icon="!!props.row.videoUrl ? 'smart_display' : 'download'"
              :loading="props.row.videoUrl === 'loading'"
              size="xs"
              @click="
                clickDownOrViewer(
                  !!props.row.videoUrl,
                  String(props.row.seekTime)
                )
              "
            />
          </q-td>
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
