import { Notify, Dialog } from "quasar";
import type { CutType } from "@/types";

export const useCutStore = async (videoName: string) => {
  const state = useState<CutType[]>(`${videoName}CutStore`, () => []);
  if (state.value.length === 0) {
    state.value = await fetchHighlightsByVideoName(videoName);
  }
  return state;
};

export const addCut = async () => {
  const videoPropsStore = useVideoPropsStore();
  const { currentTime, videoName } = videoPropsStore.value;

  const currGame = useCurrGame();
  const cutStore = await useCutStore(videoName);
  const newStore = [...cutStore.value].filter(
    (c) => c.seekTime !== currentTime
  );
  const isCancelCut = newStore.length < cutStore.value.length;
  if (isCancelCut) {
    Dialog.create({
      title: "컷 삭제",
      ok: "삭제",
      cancel: "취소",
    }).onOk(() => {
      cutStore.value = newStore;
      useFetch("/api/highlights", {
        method: "delete",
        body: { videoName, seekTime: currentTime },
      });
    });
    return;
  }

  const [gameNo, quaterNo] = currGame.value.split(/g|q/g, 2);

  const createData = {
    gameNo: +gameNo,
    quaterNo: +quaterNo,
    seekTime: currentTime,
  } as any;

  cutStore.value = [...newStore, createData].sort(
    (a, b) => time2sec(a.seekTime) - time2sec(b.seekTime)
  );

  await useFetch("/api/highlights", {
    method: "post",
    body: { videoName, seekArr: [createData] },
  });

  return currentTime;
};

export const addCuts = async (props: {
  videoName: string;
  cuts: CutType[];
}) => {
  const { videoName, cuts } = props;
  await useFetch("/api/highlights", {
    method: "post",
    body: { videoName, seekArr: cuts },
  });
};

export const updateCutWithoutFetch = async (
  type: "mainPlayer" | "subPlayer" | "skill" | "videoUrl" | "seekTime",
  value: string,
  targetTime?: string
) => {
  const videoPropsStore = useVideoPropsStore();
  const videoName = videoPropsStore.value.videoName;
  const cutStore = await useCutStore(videoName);
  const cut = cutStore.value.find((c) => c.seekTime === targetTime);
  const updateData = { ...cut, [type]: value } as CutType;
  cutStore.value = cutStore.value.map((c) =>
    c.seekTime === targetTime ? updateData : c
  );
};

export const updateCut = async (
  type: "mainPlayer" | "subPlayer" | "skill" | "videoUrl" | "seekTime",
  value: string,
  targetTime?: string
) => {
  const videoPropsStore = useVideoPropsStore();
  const videoName = videoPropsStore.value.videoName;
  const cutTime = targetTime || videoPropsStore.value.currentTime;

  const cutStore = await useCutStore(videoName);
  const cut = cutStore.value.find((c) => c.seekTime === cutTime);

  if (!cut) {
    Notify.create(`기록된 시간을 선택해주세요`);
    return;
  }

  if ("seekTime" === type) {
    const alreadyRecordedTime =
      cutStore.value.filter((c) => c.seekTime === value).length > 0;
    if (alreadyRecordedTime) {
      Notify.create(`이미 기록된 시간입니다!`);
      return;
    }
  }

  if ("mainPlayer" === type) {
    if (cut.subPlayer === value) {
      Notify.create(`서브 선수와 다른 메인 선수를 입력해주세요`);
      return;
    }
  }

  if ("subPlayer" === type) {
    if (!cut.mainPlayer) {
      Notify.create(`메인 선수를 먼저 입력해주세요`);
      return;
    }
    if (cut.mainPlayer === value) {
      Notify.create(`메인 선수와 다른 서브 선수를 입력해주세요`);
      return;
    }
  }

  const updateData = { ...cut, [type]: value } as CutType;
  cutStore.value = cutStore.value.map((c) =>
    c.seekTime === cutTime ? updateData : c
  );

  await useFetch("/api/highlights/sync", {
    method: "post",
    body: { videoName, seekTime: cutTime, seekArr: [updateData] },
  });
};

export const moveNextCut = async (n: 1 | 0 | -1) => {
  const videoPropsStore = useVideoPropsStore();
  const { videoName, currentTime: cutTime } = videoPropsStore.value;
  const cutStore = await useCutStore(videoName);
  let targetIdx = -1;
  cutStore.value.forEach((cut, idx) => {
    if (targetIdx < 0 && cut.seekTime >= cutTime) targetIdx = idx;
  });
  if (!cutStore.value.find((cut) => cut.seekTime === cutTime)) n = 0;
  return (
    cutStore.value.find((_, i) => i === targetIdx + n) || {
      seekTime: "0:00:00",
    }
  );
};

export async function fetchHighlightsByVideoName(videoName: string) {
  const { data } = await useFetch<CutType[]>("/api/highlights", {
    params: { videoName },
  });
  return data.value || [];
}

export async function fetchAllGameCut(props: {
  clubCode: string;
  playDate: string;
  gameNo: string;
}) {
  const { clubCode, playDate, gameNo } = props;
  const { data } = await useFetch<CutType[]>("/api/highlights/game", {
    params: { clubCode, playDate, gameNo },
  });
  return convertCutsWithMomentStat(data.value || []);
}
