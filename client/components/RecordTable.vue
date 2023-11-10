<script setup lang="ts">
import type { CutType } from "@/types";
import { Loading, QSpinner } from "quasar";

const emits = defineEmits<{ (e: "moveSeekPoint", time: string): void }>();

const videoProps = useVideoPropsStore();
const currTime = toRef(videoProps.value, "currentTime");
const currVideoName = toRef(videoProps.value, "videoName");

const videoViewerOn = ref(false);
const videoViewerSrc = ref("");

const gameTab = ref("1");
const quaterTab = ref("1");
const currGame = useCurrGame();

let cutStore = await useCutStore(currVideoName.value);

watch([gameTab, quaterTab], () => {
  currGame.value = gameTab.value + "g" + quaterTab.value + "q";
});

watch(currVideoName, async () => {
  cutStore = await useCutStore(currVideoName.value);
  const temp = gameTab.value;
  gameTab.value = "";
  gameTab.value = temp;
});
``;

const file = ref();
const uploader = ref();

const upGameData = (e: any) => {
  uploader.value.pickFiles(e);
};
const submit = async (files: File[]) => {
  for (const f of files) {
    const cuts = (await readFileAsJSON(f)) as CutType[];
    const videoName = cuts[0].videoName || "";
    addCuts({ videoName, cuts });
  }
};

const downGameData = () => {
  const data =
    cutStore.value?.map((cut) => ({
      ...cut,
      videoName: currVideoName.value,
    })) || [];
  console.log({ data });
  if (data.length === 0) {
    Notify.create("데이터가 없습니다.");
    return;
  }
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

const makeVideo = async (cut: CutType) => {
  const { seekTime } = cut;
  emits("moveSeekPoint", seekTime);

  const { videoName, videoSize } = videoProps.value;
  const [clubCode, playDate, gameNo, ...rest] = videoName.split("_");

  const cuts = await fetchAllGameCut({ clubCode, playDate, gameNo });
  const getLastQuaterSec = (q: number) =>
    cuts
      .filter((c) => c.quaterNo === q)
      .map((c) => time2sec(c.seekTime))
      .sort((a, b) => b - a)[0];
  const cutsWithStat = await getCutsWithStat({ cuts, seekTime });
  if (!cutsWithStat || !("seekTime" in cutsWithStat)) return;

  const path = [
    clubCode,
    playDate,
    currGame.value,
    seekTime.replace(/:/g, "") +
      "_" +
      rest.join("_").replace(".mp4", "").replace(".MOV", ""),
  ].join("/");

  const start = performance.now();
  const backboardPositionState = useBackboardPositionState();
  const lastQuaterSec = getLastQuaterSec(+quaterTab.value);
  const { file } = await createCaptureVideo(
    videoSize,
    cutsWithStat,
    backboardPositionState.value,
    lastQuaterSec
  );
  console.log(
    "canvas draw",
    Math.round((performance.now() - start) / 100) / 10
  );
  const start2 = performance.now();
  if (file === null) return;

  const body = new FormData();
  body.append("file", file);
  body.append("path", path);
  const { data } = await useFetch("/api/upload", { method: "POST", body });
  if (!data.value) return;
  console.log("ffmpeg", Math.round((performance.now() - start2) / 100) / 10);

  const { fileUrl } = data.value;
  updateCut("videoUrl", fileUrl, seekTime);
};

const makeAllVideo = async () => {
  const totalSize = cutStore.value?.length || 1;
  const startTime = new Date();
  let isCancel = false;

  const dialog = Dialog.create({
    title: "영상 만드는 중",
    progress: { spinner: QSpinner, color: "green" },
    html: true,
    cancel: "취소",
    persistent: true,
    ok: false,
  }).onCancel(() => {
    isCancel = true;
    Notify.create("작업이 취소되었습니다.");
  });

  let message;
  for (const [idx, cut] of cutStore.value?.entries() || []) {
    if (isCancel) break;
    const { gameNo, quaterNo } = cut;
    const _gameTab = gameNo + "";
    const _quaterTab = quaterNo + "";
    if (gameTab.value !== _gameTab) gameTab.value = _gameTab;
    if (quaterTab.value !== _quaterTab) quaterTab.value = _quaterTab;
    const elapsedTime = prettyElapsedTime(startTime, new Date());
    const percent = (((idx + 1) / totalSize) * 100).toFixed(2);
    message =
      `<span style="font-weight:bold;font-size:36px">${percent}%</span><br/>` +
      `(${totalSize}건 중 ${idx + 1}건)<br/>` +
      `소요시간 : ${elapsedTime}`;
    dialog.update({ message });
    await makeVideo(cut);
    await delay(1);
  }

  const elapsedTime = prettyElapsedTime(startTime, new Date());
  const completeMsg =
    `<span style="font-weight:bold;font-size:36px">${totalSize}건</span><br/>` +
    `작업 완료<br/>` +
    `소요시간 : ${elapsedTime}`;
  dialog.update({
    title: "영상 작업 완료",
    message: completeMsg,
    progress: false,
    ok: "확인",
    cancel: false,
  });
};

const makeVideoWithLoading = async (cut: CutType) => {
  Loading.show({
    message: "업로드중입니다",
    boxClass: "bg-grey-2 text-grey-9",
    spinnerColor: "primary",
  });
  await makeVideo(cut);
  Loading.hide();
};

const openViewer = async (videoUrl: string, cut: CutType) => {
  const { seekTime } = cut;
  if (!videoUrl) {
    await makeVideoWithLoading(cut);
  } else {
    emits("moveSeekPoint", seekTime);
    await delay(0.3);
  }
  videoViewerOn.value = true;
  videoViewerSrc.value = videoUrl;
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
    <q-dialog v-model="videoViewerOn">
      <mini-video :src="videoViewerSrc" />
    </q-dialog>
    <div class="row" style="gap: 12px; padding: 12px">
      <q-btn
        color="pink"
        text-color="white"
        icon-right="file_download"
        @click="makeAllVideo"
      >
        일괄 업로드
      </q-btn>
      <q-btn
        color="green"
        text-color="white"
        icon-right="file_download"
        @click="downGameData"
      >
        JSON 내려받기
        <q-file
          ref="uploader"
          v-model="file"
          multiple
          borderless
          dense
          @update:model-value="submit"
          style="display: none"
        />
      </q-btn>
      <q-btn
        color="green"
        text-color="white"
        icon-right="file_upload"
        @click="upGameData"
      >
        JSON 업로드
      </q-btn>
    </div>
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
      class="my-sticky-header-table"
      row-key="seekTime"
      :columns="columns"
      :rows="cutStore"
      :filter="[gameTab, quaterTab]"
      :filter-method="filterMethod"
      :rows-per-page-options="[0]"
      :hide-pagination="true"
    >
      <template #no-data>
        <div>
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
          <q-td key="skill" :props="props">
            {{ props.row.skill || "득점&어시" }}
          </q-td>
          <q-td key="mainPlayer" :props="props">
            {{ props.row.mainPlayer }}
          </q-td>
          <q-td key="subPlayer" :props="props">
            {{ props.row.subPlayer }}
          </q-td>
          <q-td key="videoUrl" :props="props">
            <q-btn
              :icon="'movie_edit'"
              size="xs"
              :style="{ padding: '4px 8px' }"
              @click="makeVideoWithLoading(props.row)"
            />
            <q-btn
              :icon="'smart_display'"
              :disable="!props.row.videoUrl"
              size="xs"
              :style="{ padding: '4px 8px' }"
              @click="openViewer(props.row.videoUrl, props.row)"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <q-separator color="grey-7" size="0.5px" />
  </div>
</template>
<style>
.my-sticky-header-table {
  height: calc(100vh - 185px);

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th {
    background-color: #000;
  }

  thead tr th {
    position: sticky;
    z-index: 1;
  }

  thead tr:first-child th {
    top: 0;
  }

  &.q-table--loading thead tr:last-child th {
    top: 48px;
  }

  tbody {
    scroll-margin-top: 48px;
  }
}

.q-table__container {
  border-radius: 0;
}
</style>
