type VideoPropsType = {
  videoCode: string; //gba_20231007
  videoName: string;
  videoUrl: string;
  videoSize: number;
  currentTime: string;
  videoEl?: HTMLVideoElement;
};

export const useVideoPropsStore = () => {
  return useState<VideoPropsType>(`VideoPropsStore`, () => ({
    videoCode: "",
    videoName: "",
    videoUrl: "",
    videoSize: 0,
    currentTime: "",
  }));
};

export const getGameInfoByVideoName = (videoName: string) => {
  const [clubCode, playDate, gameNo] = videoName.split("_");
  return { clubCode, playDate, gameNo };
};

export const getCutVideoPath = (videoName: string, seekTime: string) => {
  const [clubCode, playDate, _, ...rest] = videoName.split("_");
  const currGame = useCurrGame();
  return [
    clubCode,
    playDate,
    currGame.value,
    seekTime.replace(/:/g, "") +
      "_" +
      rest.join("_").replace(".mp4", "").replace(".MOV", ""),
  ].join("/");
};

export const useVideoStore = () => {
  return useState<any>(`VideoStore`, () => ({
    videoElems: [],
    currSpeed: 1.5,
    syncedTime: 0,
  }));
};

export const getSyncTime = () => {
  const videoStore = useVideoStore();
  const videoElems = videoStore.value.videoElems;
  if (videoElems.length < 2) return 0;
  return Math.round(
    videoElems[1].video.currentTime - videoElems[0].video.currentTime
  );
};
