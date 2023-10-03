type ControlOption = {
  fastForwardSec: 3 | 5;
  rewindSec: 3 | 5;
};

export const useControlState = () => {
  return useState<ControlOption>("ControlState", () => ({
    fastForwardSec: 3,
    rewindSec: 3,
  }));
};
