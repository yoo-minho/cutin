import ffmpeg from "fluent-ffmpeg";
import fs from "node:fs";

export const ffmpegPromise = ({ inputPath, outputPath }) => {
  console.log("ffmpegPromise");
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(inputPath)
      .videoFilters("setpts=2.5*PTS")
      .fps(24)
      .videoCodec("libx265")
      .output(outputPath)
      .on("start", function (commandLine) {
        // console.log("FFmpeg process started with command: " + commandLine);
      })
      .on("data", function (data) {
        // console.log("stdout: " + data);
      })
      .on("end", () => {
        // console.log("ffmpegPromise end");
        resolve();
      })
      .on("error", (x, y, z) => {
        // console.log("uuu", x, y, z);
        reject();
      })
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
