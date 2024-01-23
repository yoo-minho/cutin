<script setup lang="ts">
import type { CutType } from "@/types";
import type { QTabPanel, QTabPanels } from "quasar";

definePageMeta({
  layout: "watch-detail",
});

const route = useRoute();
const { gameCode } = route.params;
const [clubCode, playDate, gameNo] = (gameCode as string).split("_");
const { data } = await useFetch<{ name: string }>(`/api/club/${clubCode}`);
const { name } = data.value || {};
const title = `${name}'s video | ${formatGameDate(playDate, gameNo)}`;
const layoutState = useState<any>("layoutState", () => ({ title }));
layoutState.value.title = title;

const _desc = "농구 영상 편집 & 스탯 기록 & 배포를 쉽게 하는 플랫폼";

useSeoMeta({
  title,
  ogTitle: title,
  description: _desc,
  ogDescription: _desc,
  ogImage: "https://cutin.cc/og-image.png",
  twitterCard: "summary_large_image",
});

const { tab = "1q" } = route.query;
const refTab = ref(String(tab) || "1q");

const getAllGameCuts = async () => {
  const [clubCode, playDate, gameNo] = String(route.params.gameCode).split("_");
  const allGameCuts = await fetchAllGameCut({ clubCode, playDate, gameNo }); //매번 불러오는 비효율
  return allGameCuts;
};

const cuts = ref<CutType[]>(await getAllGameCuts());
const video = ref<HTMLVideoElement>();
const idx = ref(0);
const currentCut = ref<CutType>();

onMounted(() => {
  watch(
    idx,
    () => {
      currentCut.value = cuts.value[idx.value];
      refTab.value = currentCut.value.quaterNo + "q";
    },
    { immediate: true }
  );
});

const loadedVideoElem = (elem?: HTMLVideoElement) => {
  if (!elem) return;
  video.value = elem;
  video.value.autoplay = false;
  const skillPoints = getSkillPoints(currentCut.value?.skill);
  if (skillPoints.main.pts > 0) {
    video.value.playbackRate = 1;
  } else {
    video.value.playbackRate = 2;
  }
  video.value.play();
};

const gamePanel = ref<QTabPanels>();
const endedVideoElem = (elem?: HTMLVideoElement) => {
  if (!elem) return;
  idx.value++;

  setTimeout(() => {
    if (gamePanel.value) {
      const panelEm = gamePanel.value.$el as HTMLDivElement;
      const panelScrollEm = panelEm.querySelector(".scroll") as HTMLDivElement;
      const targetEm = panelEm.querySelector(".now") as HTMLDivElement;
      panelScrollEm.scrollTop = targetEm.offsetTop;
    }
  }, 0);
};
</script>
<template>
  <div
    class="bg-dark text-white"
    style="flex: 1; overflow: hidden; display: flex; flex-direction: column"
  >
    <ViewerVideoWithCanvas
      :cut="currentCut"
      :width-limit="true"
      @loaded-video-url="loadedVideoElem"
      @ended-video-url="endedVideoElem"
    />
    <div
      class="row bg-dark items-center"
      style="height: 20px; margin: 4px 10px"
    >
      <template v-for="index in cuts.length">
        <div
          v-if="idx + 1 === index"
          style="
            display: flex;
            justify-content: center;
            width: 20px;
            font-size: 18px;
            line-height: 20px;
          "
        >
          🏀
        </div>
        <div style="flex: 1; background-color: white; height: 4px"></div>
      </template>
    </div>
    <div
      style="flex: 3; display: flex; flex-direction: column; overflow: hidden"
    >
      <q-tabs
        v-model="refTab"
        dense
        :active-bg-color="`orange-7`"
        :active-color="`text-white`"
      >
        <q-tab name="1q" label="1쿼터" style="flex: 1" />
        <q-tab name="2q" label="2쿼터" style="flex: 1" />
        <q-tab name="3q" label="3쿼터" style="flex: 1" />
        <q-tab name="4q" label="4쿼터" style="flex: 1" />
      </q-tabs>
      <q-tab-panels
        v-model="refTab"
        class="bg-dark text-white"
        style="flex: 1"
        ref="gamePanel"
      >
        <q-tab-panel v-for="quater in [1, 2, 3, 4]" :name="`${quater}q`">
          <ViewerItemBroadcastLine
            v-for="c in cuts
              .map((c, i) => ({ ...c, no: i }))
              .filter((c) => c.quaterNo === quater)"
            :cut="c"
            class="cursor-pointer"
            :class="{ 'text-orange': idx === c.no, now: idx === c.no }"
            @click="idx = c.no"
          />
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>
