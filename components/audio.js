import ffmpeg from "fluent-ffmpeg";

export const concatenateAudio = (inputPath, outputPath, repeatCount) => {
  return new Promise((resolve, reject) => {
    const cmd = ffmpeg();
    for (let i = 0; i < repeatCount; i++) {
      cmd.input(inputPath);
    }
    cmd
      .complexFilter([`concat=n=${repeatCount}:v=0:a=1[out]`], "out")
      .output(outputPath)
      .on("end", () => {
        console.log("오디오 이어붙이기 완료:", outputPath);
        resolve();
      })
      .on("error", (err) => {
        console.error("오류 발생:", err);
        reject();
      })
      .run();
  });
};

export const mergeAudio = (option) => {
  const { outputPath, bgmPath } = option;
  const start = performance.now();
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(outputPath)
      .input(bgmPath)
      .audioCodec("aac")
      .output(outputPath.replace(".mp4", "_audio.mp4"))
      .outputOptions(["-map 0:v", "-map 1:a", "-shortest"])
      .on("end", () => {
        const executionTime = (performance.now() - start).toFixed(2);
        console.log(`오디오붙이기 완료 [${executionTime}ms]`);
        resolve();
      })
      .on("error", (err) => {
        console.error(`mergeAudio Error`, err);
        reject(err);
      })
      .run();
  });
};
