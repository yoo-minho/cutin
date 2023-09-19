export const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.ceil(time % 60);
  if (seconds === 60) return `${minutes + 1}:00`;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export const time2sec = (time: string) => {
  const times = time.split(":", 2);
  return +times[0] * 60 + +times[1];
};
