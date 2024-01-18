import { Notify, Dialog } from "quasar";
import type { CutType } from "@/types";

export const useCutStore = async (videoName: string) => {
  const state = useState<CutType[]>(`${videoName}CutStore`, () => []);
  if (state.value.length === 0) {
    state.value = await fetchHighlightsByVideoName(videoName);
  }
  return state;
};

export const getTargetByVideo = async () => {
  const videoStore = useVideoStore();
  if (videoStore.value.videoElems.length === 0) {
    Notify.create(`영상 등록해주세요!`);
    return;
  }

  let targetVideoNameArr = [];
  let targetCutArr = [] as CutType[];
  for (const elem of videoStore.value.videoElems) {
    const cutStore = await useCutStore(elem.videoName);
    const cutTime = elem.video.currentTime;
    const cut = cutStore.value.find((c) => {
      return c.seekTime === formatTime(cutTime);
    });
    if (cut) {
      targetVideoNameArr.push(elem.videoName);
      targetCutArr.push(cut);
    }
  }

  if (targetCutArr.length === 0) {
    Notify.create(`기록된 시간을 선택해주세요`);
    return;
  }

  if (targetCutArr.length === 2) {
    Notify.create(`말이 안 되는 상황!`);
    return;
  }

  return { targetCut: targetCutArr[0], targetVideoName: targetVideoNameArr[0] };
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

export const addCutV2 = async (videoNo: number) => {
  const videoStore = useVideoStore();
  if (videoStore.value.videoElems.length === videoNo) {
    Notify.create(`영상 등록해주세요!`);
    return;
  }

  const elem = videoStore.value.videoElems[videoNo];
  const cutStore = await useCutStore(elem.videoName);
  const cutTime = formatTime(elem.video.currentTime);
  const cut = cutStore.value.find((c) => c.seekTime === cutTime);
  if (cut) {
    Dialog.create({
      title: "컷 삭제",
      ok: "삭제",
      cancel: "취소",
    }).onOk(() => {
      cutStore.value = [...cutStore.value].filter(
        (c) => c.seekTime !== cut.seekTime
      );
      useFetch("/api/highlights", {
        method: "delete",
        body: { videoName: elem.videoName, seekTime: cut.seekTime },
      });
    });
    return;
  }

  const currGame = useCurrGame();
  const [gameNo, quaterNo] = currGame.value.split(/g|q/g, 2);
  const createData = {
    gameNo: +gameNo,
    quaterNo: +quaterNo,
    seekTime: cutTime,
  } as any;

  cutStore.value = [...cutStore.value, createData].sort(
    (a, b) => time2sec(a.seekTime) - time2sec(b.seekTime)
  );

  videoStore.value.videoElems.forEach((el: any) => {
    el.stopPlayer();
  });

  await useFetch("/api/highlights", {
    method: "post",
    body: { videoName: elem.videoName, seekArr: [createData] },
  });

  elem.movePlayer(cutTime);
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
  await useFetch("/api/highlights/sync", {
    method: "post",
    body: { videoName, seekTime: cutTime, seekArr: [updateData] },
  });
  cutStore.value = cutStore.value.map((c) =>
    c.seekTime === cutTime ? updateData : c
  );
};

export const updateCutV2 = async (
  type: "mainPlayer" | "subPlayer" | "skill" | "videoUrl" | "seekTime",
  value: string,
  targetTime?: string
) => {
  const target = await getTargetByVideo();
  if (!target) return { error: true };

  const { targetCut, targetVideoName } = target;

  if ("seekTime" === type) {
    if (Math.abs(time2sec(targetCut.seekTime) - time2sec(value)) > 3) {
      return { error: false };
    }
  }

  if ("mainPlayer" === type) {
    if (targetCut.subPlayer === value) {
      Notify.create(`서브 선수와 다른 메인 선수를 입력해주세요`);
      return { error: true };
    }
  }

  if ("subPlayer" === type) {
    if (!targetCut.mainPlayer) {
      Notify.create(`메인 선수를 먼저 입력해주세요`);
      return { error: true };
    }
    if (targetCut.mainPlayer === value) {
      Notify.create(`메인 선수와 다른 서브 선수를 입력해주세요`);
      return { error: true };
    }
  }

  const updateData = { ...targetCut, [type]: value } as CutType;
  const { error } = await useFetch("/api/highlights/sync", {
    method: "post",
    body: {
      videoName: targetVideoName,
      seekTime: targetCut.seekTime,
      seekArr: [updateData],
    },
  });
  if (error.value) {
    Notify.create(error.value.data.message);
    return { error: true };
  }

  const cutStore = await useCutStore(targetVideoName);
  cutStore.value = cutStore.value.map((c) =>
    c.seekTime === targetCut?.seekTime ? updateData : c
  );
  return { error: false };
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
