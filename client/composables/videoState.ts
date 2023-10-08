type VideoPropsType = {
  videoCode: string;
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
