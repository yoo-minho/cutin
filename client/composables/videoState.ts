type VideoPropsType = {
  videoCode: string; //gba_20231007
  videoName: string;
  videoUrl: string;
  videoSize: number;
  currentTime: string;
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
