import type { CutType } from "@/types";
import { QSpinner } from "quasar";

export const downVideo = async (cut: CutType) => {
  const videoStore = useVideoStore();
  videoStore.value.isMediaRecording = true;
  const _videoObject = videoStore.value.videoElems.find((e: any) => e.videoName === cut.videoName);
  const { videoName, createCaptureVideo } = _videoObject;
  const { file } = await createCaptureVideo(cut);
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    if (!event.target?.result) return;
    const blob = new Blob([event.target.result], { type: file.type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = cut.seekTime + videoName;
    a.click();
    URL.revokeObjectURL(url);
    videoStore.value.isMediaRecording = false;
  };
  fileReader.readAsArrayBuffer(file);
};

export const makeVideo = async (cut: CutType) => {
  const videoStore = useVideoStore();
  videoStore.value.isMediaRecording = true;

  //탭 싱크
  const { gameNo, quaterNo } = cut;
  const currGame = useCurrGame();
  currGame.value = `${gameNo}g${quaterNo}q`;

  const videoObject = videoStore.value.videoElems.find((e: any) => e.videoName === cut.videoName);
  const { videoName, createCaptureVideo } = videoObject;
  const { file, duration } = await createCaptureVideo(cut);
  const seekTime = cut.seekTime;
  const path = getCutVideoPath(videoName, seekTime);
  const { data } = await useFetch("/api/upload", {
    method: "POST",
    body: json2Form({ file, path, videoName, seekTime, duration }),
  });
  if (!data.value) throw { message: "에러다!!" };
  const { videoUrl } = data.value;
  updateCutWithoutFetch("videoUrl", videoUrl, seekTime);
  videoStore.value.isMediaRecording = false;
};

export const makeVideosByAllVideoElem = async () => {
  const startTime = new Date();
  let isCancel = false;

  const videoStore = useVideoStore();
  videoStore.value.isMediaRecording = true;

  let allCuts = [] as any[];

  for (const videoObject of videoStore.value.videoElems) {
    const { videoName } = videoObject;
    const cuts = await fetchHighlightsByVideoName(videoName);
    allCuts = [...allCuts, ...cuts.filter((cut) => !!cut.mainPlayer)];
  }

  const totalSize = allCuts.length;

  const dialog = Dialog.create({
    title: "영상 만드는 중",
    progress: { spinner: QSpinner, color: "green" },
    html: true,
    cancel: "취소",
    persistent: true,
    ok: false,
  }).onCancel(() => {
    isCancel = true;
    videoStore.value.isMediaRecording = false;
    Notify.create("작업이 취소되었습니다.");
  });

  for (const [idx, cut] of allCuts.entries()) {
    if (isCancel) break;
    const elapsedTime = prettyElapsedTime(startTime, new Date());
    const percent = (((idx + 1) / totalSize) * 100).toFixed(2);
    const message =
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
  videoStore.value.isMediaRecording = false;
};
