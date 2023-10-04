import { Notify, Dialog } from "quasar";

type CutType = {
  game: string;
  time: string;
  scorer?: string;
  assister?: string;
  skill?: string;
};

export const useCutStore = (name: string = "") => {
  const videoPropsStore = useVideoPropsStore();
  name = name || videoPropsStore.value.videoName;
  return useState<CutType[]>(`${name}CutStore`, () => loadCutStore());
};

export const addCut = () => {
  const videoPropsStore = useVideoPropsStore();
  const { currentTime } = videoPropsStore.value;

  const currGame = useCurrGame();
  const cutStore = useCutStore();
  const newStore = [...cutStore.value].filter((c) => c.time !== currentTime);
  const isCancelCut = newStore.length < cutStore.value.length;
  if (isCancelCut) {
    Dialog.create({
      title: "컷 삭제",
      ok: "삭제",
      cancel: "취소",
    }).onOk(() => {
      cutStore.value = newStore;
      saveCutStore();
    });
    return;
  }

  cutStore.value = [
    ...newStore,
    { game: currGame.value, time: currentTime },
  ].sort((a, b) => time2sec(a.time) - time2sec(b.time));
  saveCutStore();
  return currentTime;
};

export const updateCut = (
  type: "scorer" | "assister" | "skill",
  value: string
) => {
  const videoPropsStore = useVideoPropsStore();
  const cutTime = videoPropsStore.value.currentTime;

  const cutStore = useCutStore();
  const cut = cutStore.value.find((c) => c.time === cutTime);

  if (!cut) {
    Notify.create(`기록된 시간을 선택해주세요`);
    return;
  }

  if ("scorer" === type) {
    if (cut.assister === value) {
      Notify.create(`어시스트 선수와 다른 득점 선수를 입력해주세요`);
      return;
    }
  }

  if ("assister" === type) {
    if (!cut.scorer) {
      Notify.create(`득점 선수를 먼저 입력해주세요`);
      return;
    }
    if (cut.scorer === value) {
      Notify.create(`득점 선수와 다른 어시스트 선수를 입력해주세요`);
      return;
    }
  }

  const data = { [type]: value };
  cutStore.value = cutStore.value.map((c) =>
    c.time === cutTime ? { ...c, ...data } : { ...c }
  );
  saveCutStore();
};

function saveCutStore() {
  const videoPropsStore = useVideoPropsStore();
  const currVideoName = videoPropsStore.value.videoName;
  const cutStore = useCutStore(currVideoName);
  localStorage.setItem(`cut_${currVideoName}`, JSON.stringify(cutStore.value));
}

function loadCutStore() {
  const videoPropsStore = useVideoPropsStore();
  const currVideoName = videoPropsStore.value.videoName;
  try {
    return JSON.parse(localStorage.getItem(`cut_${currVideoName}`) || "[]");
  } catch (e) {
    return [];
  }
}
