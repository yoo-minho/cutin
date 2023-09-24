type Position = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type Tracking = {
  start: string;
  end: string;
  startIdx: number;
  endIdx: number;
};

export const useBackboardTrackingState = () => {
  return useState<Tracking[]>("BackboardTracking", () => []);
};

export const useBackVideoState = () => {
  return useState<HTMLVideoElement>("BackVideo");
};

export const useBackboardPositionState = () => {
  return useState<Position>("BackboardPostion", () => ({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  }));
};

const headerHeight = 68.96;
const calX = (x: number) => Math.round((1920 * x) / 960);
const calY = (x: number) => Math.round((1080 * x) / 540);

export const calculateBackboardPosition = () => {
  const state = useBackboardPositionState();
  return computed(() => {
    const { top, left, width, height } = state.value;
    return {
      top: calX(top - headerHeight),
      left: calY(left),
      width: calX(width),
      height: calY(height),
    };
  });
};
