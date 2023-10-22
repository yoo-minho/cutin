import { Notify, Dialog } from "quasar";
import { CutType } from "@/types";

export const useCutStore = (name: string = "") => {
  const videoPropsStore = useVideoPropsStore();
  name = name || videoPropsStore.value.videoName;
  const x = useState<CutType[]>(`${name}CutStore`, () => []);
  if (x.value.length === 0) {
    loadCutStore().then((data) => (x.value = data));
  }
  return x;
};

export const addCut = async () => {
  const videoPropsStore = useVideoPropsStore();
  const { currentTime, videoName } = videoPropsStore.value;

  const currGame = useCurrGame();
  const cutStore = useCutStore();
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
  } as CutType;

  cutStore.value = [...newStore, createData].sort(
    (a, b) => time2sec(a.seekTime) - time2sec(b.seekTime)
  );

  await useFetch("/api/highlights", {
    method: "post",
    body: { videoName, seekArr: [createData] },
  });

  return currentTime;
};

export const updateCut = async (
  type: "mainPlayer" | "subPlayer" | "skill" | "videoUrl",
  value: string
) => {
  const videoPropsStore = useVideoPropsStore();
  const videoName = videoPropsStore.value.videoName;
  const cutTime = videoPropsStore.value.currentTime;

  const cutStore = useCutStore(videoName);
  const cut = cutStore.value.find((c) => c.seekTime === cutTime);

  if (!cut) {
    Notify.create(`기록된 시간을 선택해주세요`);
    return;
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

  if ("loading" === value) return;

  await useFetch("/api/highlights/sync", {
    method: "post",
    body: { videoName, seekArr: [updateData] },
  });
};

async function loadCutStore() {
  const videoPropsStore = useVideoPropsStore();
  const videoName = videoPropsStore.value.videoName;
  const { data } = await useFetch<CutType[]>("/api/highlights", {
    params: { videoName },
  });
  return data.value || [];
}
