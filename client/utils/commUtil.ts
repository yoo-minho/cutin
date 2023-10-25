export const formatTime = (time: number) => {
  if (isNaN(+time)) return "0:00:00";
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.ceil(time % 60);
  return [
    String(hours),
    String(minutes).padStart(2, "0"),
    String(seconds).padStart(2, "0"),
  ].join(":");
};

export const time2sec = (time: string) => {
  const times = time.split(":", 3);
  if (times.length === 2) {
    return +times[0] * 60 + +times[1];
  }
  return +times[0] * 3600 + +times[1] * 60 + +times[2];
};

export const prettyElapsedTime = (startDate: any, endDate: any) => {
  const elapsedMilliseconds = endDate - startDate;
  const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  const elapsedHours = Math.floor(elapsedMinutes / 60);
  const hours = String(elapsedHours).padStart(2, "0");
  const minutes = String(elapsedMinutes % 60).padStart(2, "0");
  const seconds = String(elapsedSeconds % 60).padStart(2, "0");
  return hours + ":" + minutes + ":" + seconds;
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

export const delay = (seconds: number) => {
  return new Promise((res) => setTimeout(res, seconds * 1000));
};
