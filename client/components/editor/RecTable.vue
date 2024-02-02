<script setup lang="ts">
import { getSyncTime } from "@/composables/videoState";
import type { CutType } from "@/types";
import { Loading, QSpinner, QTable } from "quasar";
import { findPlusElements } from "@/utils/commUtil";

const props = defineProps<{ videoNo: number }>();
const emits = defineEmits<{ (e: "moveSeekPoint", time: string): void }>();

const videoStore = useVideoStore();
const videoElem = ref();
const recTable = ref<QTable>();

let cutStore: Ref<CutType[]>;
const videoCurrTime = ref(0);
watch(
  () => videoStore.value.videoElems.length,
  async () => {
    videoElem.value = videoStore.value.videoElems[props.videoNo];

    if (videoElem.value && !cutStore) {
      cutStore = await useCutStore(videoElem.value?.videoName);
      videoElem.value.video.addEventListener("timeupdate", () => {
        videoCurrTime.value = videoElem.value.video.currentTime;
      });

      watch(
        () => cutStore.value.map((cut) => cut.seekTime),
        (newVal: string[], oldVal: string[]) => {
          const [seekTime] = findPlusElements(oldVal, newVal);
          if (seekTime) {
            const i = newVal.findIndex((v) => v === seekTime);
            //그려지는 동안 스크롤하면 안됨
            setTimeout(() => {
              recTable.value?.scrollTo(i);
            }, 100);
          }
        }
      );
    }

    //갱신??
    const temp = gameTab.value;
    gameTab.value = "";
    gameTab.value = temp;
  }
);

const gameTab = ref("1"),
  quaterTab = ref("1");
const currGame = useCurrGame();
watch([gameTab, quaterTab], ([g, q]) => (currGame.value = g + "g" + q + "q"));
watch(currGame, () => {
  const [gameNo, quaterNo] = currGame.value.split(/g|q/g, 2);
  gameTab.value = gameNo;
  quaterTab.value = quaterNo;
  (document.activeElement as HTMLBodyElement).blur();
});

const videoProps = useVideoPropsStore();

const videoViewerOn = ref(false);
const seletedCut = ref();

const filterMethod = (rows: readonly any[]) =>
  rows?.filter(
    (row) =>
      row.gameNo === +gameTab.value &&
      row.quaterNo === +quaterTab.value &&
      !!row.seekTime
  );

const makeVideo = async (cut: CutType) => {
  const { seekTime, skill, subPlayer } = cut;
  emits("moveSeekPoint", seekTime);

  const { videoName, videoSize } = videoProps.value;
  const backboardPositionState = useBackboardPositionState();
  const seekSec = time2sec(seekTime);
  const segment = getSegment(skill, subPlayer);

  const { file } = await createCaptureVideo(
    videoSize,
    seekSec,
    segment,
    backboardPositionState.value
  );
  if (file === null) return;

  const body = new FormData();
  body.append("file", file);
  body.append("path", getCutVideoPath(videoName, seekTime));
  body.append("videoName", videoName);
  body.append("seekTime", seekTime);
  const { data } = await useFetch("/api/upload", { method: "POST", body });
  if (!data.value) return;

  const { error, videoUrl } = data.value;
  if (error) {
    console.error("에러닷");
    return;
  }
  updateCutWithoutFetch("videoUrl", videoUrl, seekTime);
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

const openViewer = async (cut: CutType) => {
  const { seekTime, videoUrl, clubCode, playDate, gameNo } = cut;
  if (!videoUrl) {
    await makeVideoWithLoading(cut);
  } else {
    emits("moveSeekPoint", seekTime);
    await delay(0.3);
  }
  videoViewerOn.value = true;
  const allGameCuts = await fetchAllGameCut({ clubCode, playDate, gameNo }); //매번 불러오는 비효율
  seletedCut.value = allGameCuts.find((cut) => cut.seekTime === seekTime);
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

const movePlayer = (time: string) => {
  videoStore.value.videoElems.forEach((elem: any, idx: number) => {
    if (props.videoNo === idx) return;
    const syncTime = getSyncTime();
    const targetSec = time2sec(time);
    const timeBySync = formatTime(targetSec + (idx === 0 ? -1 : 1) * syncTime);
    elem.movePlayer(timeBySync);
    elem.stopPlayer();
  });
  videoElem.value.movePlayer(time);
  videoElem.value.stopPlayer();
};
</script>
<template>
  <ViewerSimpleVideo
    v-if="seletedCut"
    v-model="videoViewerOn"
    :cut="seletedCut"
  />
  <div class="column" style="height: 100%">
    <div class="row bg-dark items-center">
      <div style="flex: 1">
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
      </div>
      <div>
        <q-btn
          color="black"
          text-color="white"
          icon-right="file_download"
          @click="makeAllVideo"
        >
          일괄
        </q-btn>
      </div>
    </div>
    <div class="row items-center col">
      <q-table
        ref="recTable"
        dark
        flat
        dense
        class="my-sticky-header-table col"
        row-key="seekTime"
        :columns="columns"
        :rows="cutStore"
        :filter="[gameTab, quaterTab]"
        :filter-method="filterMethod"
        :rows-per-page-options="[0]"
        :hide-pagination="true"
        virtual-scroll
      >
        <template #bottom>
          <div>
            <span>
              <q-icon name="keyboard" class="q-px-xs" size="xs" /> 'C' 단축키를
              눌러 득점 순간을 기록하세요!
            </span>
          </div>
        </template>
        <template #no-data>
          <div>
            <span>
              <q-icon name="keyboard" class="q-px-xs" size="xs" />'C' 단축키를
              눌러 득점 순간을 기록하세요!
            </span>
          </div>
        </template>
        <template #body="props">
          <q-tr
            :props="props"
            :class="{
              'text-green': props.row.seekTime === formatTime(videoCurrTime),
            }"
          >
            <q-td key="seekTime" :props="props">
              <div
                class="text-pre-wrap cursor-pointer"
                @click="movePlayer(String(props.row.seekTime))"
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
                @click="openViewer(props.row)"
              />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>
<style>
.q-table__container {
  border-radius: 0;
}
</style>
<style lang="sass">
.my-sticky-header-table
  height: 100%

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    background-color: #333

  thead tr th
    position: sticky
    z-index: 1

  thead tr:first-child th
    top: 0

  &.q-table--loading thead tr:last-child th
    top: 48px

  tbody
    scroll-margin-top: 48px
</style>
