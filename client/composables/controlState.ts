type ControlOption = {
  fastForwardSec: 3 | 5 | 7 | 9;
  rewindSec: 3 | 5 | 7 | 9;
};

export const useControlState = () => {
  return useState<ControlOption>("ControlState", () => ({
    fastForwardSec: 3,
    rewindSec: 3,
  }));
};
