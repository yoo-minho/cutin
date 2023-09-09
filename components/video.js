import ffmpeg from "fluent-ffmpeg";
import { existsFile, makeFolder } from "../util.js";
import { concatenateAudio } from "./audio.js";
import { drawLeftTopBanner, drawRightTopBanner } from "./textOverlay.js";

export const cutVideo = async (option) => {
  const start = performance.now();
  const { gameInfo, bgmPath, videoPath, seekArr } = option;
  const { title, date } = gameInfo;

  const path = makeFolder({ parentDir: `_output/${title}`, childDir: date });
  const highlightPath = makeFolder({ parentDir: path, childDir: "highlight" });
  const quaterPath = makeFolder({ parentDir: path, childDir: "quater" });
  const gamePath = makeFolder({ parentDir: path, childDir: "game" });
  const playerPath = makeFolder({ parentDir: path, childDir: "player" });

  if (!existsFile(path + "/bgm.mp3")) {
    await concatenateAudio(bgmPath, path + "/bgm.mp3", 3);
  }

  //#1. 하이라이트
  const highlightArr = [];
  for (const [idx, seek] of seekArr.entries()) {
    const option = {
      idx,
      inputPath: videoPath.find((v) => v.includes(seek.v)),
      outputPath: `${highlightPath}/${idx}.mp4`,
      gameInfo,
      ...seek,
    };
    highlightArr.push(option);
    await createVideo(option);
    // if (idx === 0) return;
  }

  //   //#2. 쿼터
  //   for (let game = 1; game <= 4; game++) {
  //     for (let quater = 1; quater <= 4; quater++) {
  //       const concatFileArr = highlightArr
  //         .filter(({ g, q }) => g === game && q === quater)
  //         .map((o) => o.outputPath);
  //       if (concatFileArr.length === 0) continue;

  //       const outputPath = `${quaterPath}/${game}game${quater}quater.mp4`;
  //       await mergeVideo({ concatFileArr, outputPath });
  //     }
  //   }

  //   //#3. 게임
  //   for (let game = 1; game <= 4; game++) {
  //     const concatFileArr = highlightArr
  //       .filter(({ g }) => g === game)
  //       .map((o) => o.outputPath);
  //     if (concatFileArr.length === 0) continue;

  //     const outputPath = `${gamePath}/${game}game.mp4`;
  //     await mergeVideo({ concatFileArr, outputPath });
  //     await mergeAudio({ outputPath, bgmPath });
  //   }

  //   //#4. 플레이어
  //   const player = [
  //     ...new Set(
  //       seekArr
  //         .map((v) => [v.s, v.a])
  //         .flat()
  //         .filter((v) => !!v)
  //     ),
  //   ];
  //   player.forEach(async (player) => {
  //     const concatFileArr = highlightArr
  //       .filter(({ s, a }) => [s, a].includes(player))
  //       .map((o) => o.outputPath);
  //     if (concatFileArr.length === 0) return;

  //     const outputPath = `${playerPath}/${player}.mp4`;
  //     await mergeVideo({ concatFileArr, outputPath });
  //   });

  const executionTime = (performance.now() - start).toFixed(2);
  console.log(`작업 완료 [${executionTime}ms]`);
};

function createVideo(option) {
  const start = performance.now();
  const playbackSpeed = 1.5;
  const beforeSec = 9; //(9초=>6초, 12초=>8초)

  /*
   * t : seekTime
   * g : game
   * q : quater
   * s : scorers
   * a : assist player
   * k : skill ['자유투', '풋백', '점퍼']
   */
  const { g, q, s, a, k, t } = option;
  const { inputPath, outputPath, gameInfo, idx } = option;
  const { title, date, place } = gameInfo;

  const zoom = 1.5;
  const x = (1 - 1 / zoom) / 2;
  const y = (1 - 1 / zoom) / 4;

  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(inputPath)
      .seekInput(calculateTimeBefore(`00:${t}`, beforeSec - 1))
      .duration(`00:00:${beforeSec / playbackSpeed}`)
      .videoCodec("libx264")
      .audioCodec("aac")
      .output(outputPath)
      .videoFilter([
        `crop=in_w/${zoom}:in_h/${zoom}:in_w*${x}:in_h*${y}`,
        `setpts=${1 / playbackSpeed}*PTS`,
        `eq=brightness=0.15`,
        drawLeftTopBanner({
          logo: title,
          time: date + ` ${g}G ${q}Q`,
          place,
        }),
        drawRightTopBanner({
          title: `#${idx + 1}`,
          scorer: s,
          assister: !!a ? `assist.${a}` : "",
          skill: !!k ? k : "",
        }),
      ])
      // .size("1920x1080")
      .size("1280x720")
      // .size("960x540")
      .audioFilter(`atempo=${playbackSpeed}`) // 오디오 속도 조절 필터
      .on("end", () => {
        const executionTime = (performance.now() - start).toFixed(2);
        console.log(`자르기 완료 (${t})  [${executionTime}ms]`);
        resolve();
      })
      .on("error", (err) => {
        console.error(`createVideo Error`, err);
        reject(err);
      })
      .run();
  });
}

function mergeVideo(option) {
  const { concatFileArr, outputPath } = option;
  return new Promise((resolve, reject) => {
    const start = performance.now();
    const ffmg = ffmpeg();
    concatFileArr.forEach((f) => ffmg.input(f));
    ffmg
      .on("end", () => {
        const executionTime = (performance.now() - start).toFixed(2);
        console.log(`이어붙이기 완료 [${executionTime}ms]`);
        resolve();
      })
      .on("error", (err) => {
        console.error(`mergeVideo Error`, err);
        reject(err);
      })
      .mergeToFile(outputPath, "./temp");
  });
}

function calculateTimeBefore(inputTime = "00:00:00", sec = 4) {
  const [hours, minutes, seconds] = inputTime.split(":").map(Number);
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  const newTotalSeconds = totalSeconds - sec;
  const newHours = Math.floor(newTotalSeconds / 3600);
  const newMinutes = Math.floor((newTotalSeconds % 3600) / 60);
  const newSeconds = newTotalSeconds % 60;
  const mat = (min) => String(min).padStart(2, "0");
  return `${mat(newHours)}:${mat(newMinutes)}:${mat(newSeconds)}`;
}
