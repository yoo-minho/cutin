<script setup lang="ts">
import { getSyncTime } from "@/composables/videoState";
import type { CutType } from "@/types";
import { Loading, QTable } from "quasar";
import { findPlusElements } from "@/utils/commUtil";

const props = defineProps<{ videoNo: number }>();
const emits = defineEmits<{ (e: "moveSeekPoint", time: string): void }>();

const videoStore = useVideoStore();
const videoObject = ref();
const recTable = ref<QTable>();
const videoViewerOn = ref(false);
const seletedCut = ref();
const gameTab = ref("1");
const quaterTab = ref("1");
const currGame = useCurrGame();

let cutStore: Ref<CutType[]>;
const videoCurrTime = ref(0);

watch(
  () => videoStore.value.videoElems.length,
  async () => {
    videoObject.value = videoStore.value.videoElems[props.videoNo];

    if (videoObject.value && !cutStore) {
      cutStore = await useCutStore(videoObject.value?.videoName);
      videoObject.value.video.addEventListener("timeupdate", () => {
        videoCurrTime.value = videoObject.value.video.currentTime;
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

watch(currGame, () => {
  const [gameNo, quaterNo] = currGame.value.split(/g|q/g, 2);
  gameTab.value = gameNo;
  quaterTab.value = quaterNo;
  (document.activeElement as HTMLBodyElement).blur();
});

const filterMethod = (rows: readonly any[]) =>
  rows?.filter((row) => row.gameNo === +gameTab.value && row.quaterNo === +quaterTab.value && !!row.seekTime);

const actionWithLoading = async (message: string, func: () => Promise<void>) => {
  Loading.show({ message, boxClass: "bg-grey-2 text-grey-9", spinnerColor: "primary" });
  await func();
  Loading.hide();
};

const downloadVideoWithLoading = async (cut: CutType) => {
  actionWithLoading("다운로드중입니다", () => downVideo(cut));
};

const makeVideoWithLoading = async (cut: CutType) => {
  actionWithLoading("업로드중입니다", () => makeVideo(cut));
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
  { label: "seekTime", name: "seekTime", field: "seekTime", align: "center", style: { width: "72px" } },
  { label: "skill", name: "skill", field: "skill", align: "center", style: { width: "40%" } },
  { label: "mainPlayer", name: "mainPlayer", field: "mainPlayer", align: "center", style: { width: "30%" } },
  { label: "subPlayer", name: "subPlayer", field: "subPlayer", align: "center", style: { width: "30%" } },
  { label: "컷", name: "videoUrl", field: "videoUrl", align: "center", style: { width: "16px" } },
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
  videoObject.value.movePlayer(time);
  videoObject.value.stopPlayer();
};
</script>
<template>
  <ViewerSimpleVideo v-if="seletedCut" v-model="videoViewerOn" :cut="seletedCut" />
  <div class="column" style="height: 100%">
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
        <span><q-icon name="keyboard" class="q-px-xs" size="xs" />'C' 단축키를 눌러 득점 순간을 기록하세요!</span>
      </template>
      <template #no-data>
        <span><q-icon name="keyboard" class="q-px-xs" size="xs" />'C' 단축키를 눌러 득점 순간을 기록하세요!</span>
      </template>
      <template #body="props">
        <q-tr :class="{ 'text-green': props.row.seekTime === formatTime(videoCurrTime) }">
          <q-td key="seekTime" :props="props">
            <div class="text-pre-wrap cursor-pointer" @click="movePlayer(String(props.row.seekTime))">
              {{ props.row.seekTime }}
            </div>
          </q-td>
          <q-td key="skill" :props="props"> {{ props.row.skill || "득점&어시" }} </q-td>
          <q-td key="mainPlayer" :props="props"> {{ props.row.mainPlayer }} </q-td>
          <q-td key="subPlayer" :props="props"> {{ props.row.subPlayer }} </q-td>
          <q-td key="videoUrl" :props="props">
            <AtomXsBtn icon="download" @click="downloadVideoWithLoading(props.row)" />
            <AtomXsBtn icon="movie_edit" @click="makeVideoWithLoading(props.row)" />
            <AtomXsBtn icon="smart_display" @click="openViewer(props.row)" />
          </q-td>
        </q-tr>
      </template>
    </q-table>
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
