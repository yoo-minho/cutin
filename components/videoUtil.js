import ffmpeg from "fluent-ffmpeg";
import fs from "node:fs";

export const ffmpegPromise = ({ inputPath, outputPath, func }) => {
  return new Promise((resolve, reject) => {
    const ff = ffmpeg()
      .input(inputPath)
      .videoCodec("libx264")
      .audioCodec("aac");
    func(ff)
      .output(outputPath)
      .on("end", () => resolve())
      .on("error", () => reject())
      .run();
  });
};

export const mergePromise = ({ inputPaths, outputPath, isDelete }) => {
  return new Promise((resolve, reject) => {
    const ff = ffmpeg();
    inputPaths.forEach((path) => ff.input(path));
    ff.on("end", () => {
      if (isDelete) inputPaths.forEach(fs.unlinkSync);
      resolve();
    })
      .on("error", () => reject())
      .mergeToFile(outputPath, "./temp");
  });
};

export const cutFunc =
  ({ time, duration, speed, func = (v) => v }) =>
  (ff) =>
    func(
      ff
        .seekInput(time)
        .duration(`00:00:${duration / speed}`)
        .audioFilter(`atempo=${speed}`)
        .videoFilter([`setpts=${1 / speed}*PTS`])
        .size("1280x720")
    );

export const chunkArray = (array, chunkSize) => {
  const chunkedArray = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    chunkedArray.push(chunk);
  }
  return chunkedArray;
};
