import ffmpeg from "fluent-ffmpeg";
import { path } from "@ffmpeg-installer/ffmpeg";
ffmpeg.setFfmpegPath(path);
console.log({ path });

import fs from "node:fs";

export const ffmpegPromise = ({ inputPath, outputPath }) => {
  console.log("ffmpegPromise", { inputPath, outputPath });
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(inputPath)
      .videoFilters("setpts=2.5*PTS")
      .fps(24)
      .videoCodec("libx264") //압축 낮고 속도 높음
      // .videoCodec("libx265") //압축 높이고 속도 낮음
      .outputOptions(["-c:v h264_nvenc", "-preset fast"]) // NVENC 설정
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
        console.log("uuu", x, y, z);
        reject();
      })
      .run();
  });
};

export const mergePromise = ({ inputPaths, outputPath, isDelete }) => {
  return new Promise((resolve, reject) => {
    const ff = ffmpeg();
    console.log({ inputPaths });
    let xx = "";

    inputPaths.forEach((path, i) => {
      ff.input(path);
      xx += `[${i}:v]`;
    });

    console.log("xxxxxxxxxxxxxxx", xx);

    //   ff.complexFilter([`${xx}concat=n=${inputPaths.length}:v=1:a=0[video]`])
    //     .output(outputPath)
    //     .outputOptions([
    //       "-c:v copy", // Copy the video codec
    //     ])
    //     .on("end", () => {
    //       if (isDelete) inputPaths.forEach(fs.unlinkSync);
    //       resolve();
    //     })
    //     .on("error", (a, b, c) => {
    //       console.log(a, b, c);
    //       reject();
    //     })
    //     .run();
    //   // .mergeToFile(outputPath, "./temp");
    // });

    ff
      // .outputOptions([
      //   "-c:v copy", // Copy the video codec
      // ])
      .on("end", () => {
        if (isDelete) inputPaths.forEach(fs.unlinkSync);
        resolve();
      })
      .on("error", (a, b, c) => {
        console.log(a, b, c);
        reject();
      })
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
