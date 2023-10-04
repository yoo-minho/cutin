type VideoPropsType = {
  videoCode: string;
  videoName: string;
  videoUrl: string;
  currentTime: string;
};

export const useVideoPropsStore = () => {
  return useState<VideoPropsType>(`VideoPropsStore`, () => ({
    videoCode: "",
    videoName: "",
    videoUrl: "",
    currentTime: "",
  }));
};
