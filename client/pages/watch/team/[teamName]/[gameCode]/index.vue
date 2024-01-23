<script setup lang="ts">
import { type VsType, type RecordType, type CutType } from "@/types";
import GameItem from "../../components/GameItem.vue";

definePageMeta({
  layout: "watch-detail",
});

const route = useRoute();
const { gameCode } = route.params;
const [clubCode, playDate, gameNo] = (gameCode as string).split("_");
const { data } = await useFetch<{ name: string }>(`/api/club/${clubCode}`);
const { name } = data.value || {};
const title = `${name}'s stat | ${formatGameDate(playDate, gameNo)}`;
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

const getAllGameCuts = async () => {
  const route = useRoute();
  const [clubCode, playDate, gameNo] = String(route.params.gameCode).split("_");
  const allGameCuts = await fetchAllGameCut({ clubCode, playDate, gameNo }); //매번 불러오는 비효율
  return allGameCuts;
};

const cuts = ref<CutType[]>(await getAllGameCuts());
const { data: record } = await useFetch<[RecordType, RecordType]>(
  `/api/club/${clubCode}/game/${gameCode}/record`
);
const [aTeam, bTeam] = record.value || [];

const currentVsState = useState<VsType[]>("currentVsState", () => []);
const currentVs = ref();
if (currentVsState.value.length > 0) {
  currentVs.value = currentVsState.value.find((vs) => vs.gameCode === gameCode);
} else {
  const { data } = await useFetch<VsType[]>(
    `/api/club/${clubCode}/game/${gameCode}`
  );
  if (data.value) {
    currentVs.value = data.value.map((vs) => {
      return {
        ...vs,
        dateInfo: formatGameDate(vs.playDate, vs.gameNo),
        gameCode,
      };
    })[0];
  }
}

const openGameVideo = () => {
  const isReadyHighlight = cuts.value.filter((v) => !!v.videoUrl).length > 0;
  if (!isReadyHighlight) {
    Notify.create("영상을 준비중입니다!");
    return;
  }
  const route = useRoute();
  navigateTo({ path: `${route.path}/video` });
};

const confirmInfo = () => {
  Dialog.create({
    title: "KBL선수공헌도",
    html: true,
    message: `
    한국프로농구에서 선수 공헌도를 나타낼때 사용되는 공식. 보통 팀내 연봉 산출에 있어서 구단들에서 애용하는 스탯으로 알려져 있다.<br><br>

    KBL Efficiency(가산점 항목) = <br>
    (득점+스틸+블록슛+수비 리바운드)x1.0+<br>
    (공격 리바운드+어시스트+굿디펜스)x1.5+<br>
    출전시간(분)÷4<br><br>

    KBL Efficiency(감점 항목) = <br>
    턴오버x1.5+<br>
    2점 슛 실패x1.0+<br>
    3점 슛 실패x0.9+<br>
    자유투 실패x0.8<br><br>
    
    <hr><br>

    <b style="color:#fb8c00">
    KBL Efficiency In Cutin = <br>
    (득점+스틸+블록슛+수비 리바운드)x1.0+<br>
    (공격 리바운드+어시스트)x1.5<br>
    </b>
    `,
    position: "top",
  })
    .onOk(() => {
      // console.log('>>>> OK')
    })
    .onCancel(() => {
      // console.log('>>>> Cancel')
    })
    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    });
};
</script>
<template>
  <GameItem :vs="currentVs" type="MATCH" @click-btn="openGameVideo" />
  <q-separator color="#ccc" />
  <div class="row justify-center q-my-xs">
    <q-chip
      dense
      size="md"
      class="q-px-md"
      color="orange-7"
      text-color="white"
      clickable
      @click="confirmInfo()"
    >
      정렬조건 :
      <span class="text-bold q-mx-xs">KBL선수공헌도</span>높은순
      <q-icon name="help_outline" size="16px" />
    </q-chip>
  </div>
  <div
    class="column items-center align-center"
    style="flex: 1; overflow-y: auto; flex-wrap: nowrap"
  >
    <template v-if="aTeam">
      <div class="text-h6 q-mt-xs">{{ aTeam.teamName }}</div>
      <StatTable :player-stat="aTeam.playerStat" />
    </template>
    <template v-if="bTeam" class="q-mt-md">
      <div class="text-h6 q-mt-xs">{{ bTeam.teamName }}</div>
      <StatTable :player-stat="bTeam.playerStat" />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.teamName {
  font-size: 24px;
  font-weight: bold;
}
.score {
  font-size: 36px;
  font-weight: bolder;

  &.win {
    color: #ff8c00;
  }
}
</style>
