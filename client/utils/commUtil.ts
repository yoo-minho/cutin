export const formatTime = (time: number) => {
  if (isNaN(+time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.ceil(time % 60);
  if (seconds === 60) return `${minutes + 1}:00`;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export const time2sec = (time: string) => {
  const times = time.split(":", 2);
  return +times[0] * 60 + +times[1];
};

export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export const formatVideoDuration = (durationInSeconds: number) => {
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = Math.floor(durationInSeconds % 60);
  const formattedDuration = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  return formattedDuration;
};
