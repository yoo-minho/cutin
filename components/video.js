import ffmpeg from "fluent-ffmpeg";
import { existsFile, makeFolder } from "../util.js";
import { concatenateAudio, mergeAudio } from "./audio.js";
import {
  drawLeftTopBanner,
  drawRightTopBanner,
  drawIntroBanner,
} from "./textOverlay.js";

export const cutVideo = async (option, { step = 1 } = {}) => {
  const start = performance.now();
  const { gameInfo, bgmPath, videoPath, seekArr } = option;
  const { title, date } = gameInfo;

  const path = makeFolder({ parentDir: `_output/${title}`, childDir: date });
  const highlightPath = makeFolder({ parentDir: path, childDir: "highlight" });
  const gamePath = makeFolder({ parentDir: path, childDir: "game" });
  const playerPath = makeFolder({ parentDir: path, childDir: "player" });

  if (!existsFile(path + "/bgm.mp3")) {
    await concatenateAudio(bgmPath, path + "/bgm.mp3", 3);
  }

  //#1. 하이라이트
  const highlightArr = [];
  for (const [idx, seek] of seekArr.entries()) {
    const inputPath = videoPath.find((v) => v.includes(seek.v));
    const option = {
      idx,
      inputPath: inputPath,
      outputPath: `${highlightPath}/${idx}.mp4`,
      gameInfo,
      ...seek,
    };
    highlightArr.push(option);
    if (step === 1) {
      await createVideo(option);
    }
    // if (idx === 1) return;
  }

  if (step === 2) {
    // #3. 게임
    // for (let game = 1; game <= 4; game++) {
    //   const concatFileArr = highlightArr
    //     .filter(({ g }) => g === game)
    //     .map((o) => o.outputPath);
    //   if (concatFileArr.length === 0) continue;

    //   const outputPath = `${gamePath}/${game}game.mp4`;
    //   await mergeVideo({ concatFileArr, outputPath });
    //   await mergeAudio({ outputPath, bgmPath });
    // }

    // #4. 플레이어
    const player = [
      ...new Set(
        seekArr
          .map((v) => [v.s, v.a])
          .flat()
          .filter((v) => !!v)
      ),
    ];
    player.forEach(async (player) => {
      const playerInfo = highlightArr.filter(({ s, a }) =>
        [s, a].includes(player)
      );
      let concatFileArr = playerInfo.map((o) => o.outputPath);

      if (concatFileArr.length === 0) return;

      const playerRecord = getRecord(playerInfo, player);

      const introPath = `${playerPath}/${player}_intro.mp4`;
      await createIntroVideo({
        outputPath: introPath,
        name: player,
        record: playerRecord.join("\n\n"),
      });

      const playPath = `${playerPath}/${player}_play.mp4`;
      await mergeVideo({
        concatFileArr: concatFileArr,
        outputPath: playPath,
      });

      await mergeVideo({
        concatFileArr: [introPath, playPath],
        outputPath: `${playerPath}/${player}.mp4`,
      });
    });
  }

  const executionTime = (performance.now() - start).toFixed(2);
  console.log(`작업 완료 [${executionTime}ms]`);
};

function createVideo(option) {
  const start = performance.now();
  const playbackSpeed = 1.5;
  const brightness = 0;
  const beforeSec = 9; //(9초=>6초, 12초=>8초)
  const { g, q, s, a, k, t } = option;
  const { inputPath, outputPath, gameInfo, idx } = option;
  const { title, date, place } = gameInfo;
  const zoom = 1;
  const x = (1 - 1 / zoom) / 2;
  const y = (1 - 1 / zoom) / 4;
  const time = calculateTimeBefore(`00:${t}`, beforeSec - 1);
  const scene = `#${idx + 1}`;
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(inputPath)
      // .inputOptions(["-hwaccel nvdec"])
      .seekInput(time)
      .duration(`00:00:${beforeSec / playbackSpeed}`)
      // .videoCodec("libx264")
      // .audioCodec("aac")
      .output(outputPath)
      // .outputOption("-c:v h264_nvenc")
      .videoFilter([
        `crop=in_w/${zoom}:in_h/${zoom}:in_w*${x}:in_h*${y}`,
        `setpts=${1 / playbackSpeed}*PTS`,
        `eq=brightness=${brightness}`,
        drawLeftTopBanner({
          logo: title,
          time: date + ` ${g}G ${q}Q`,
          place,
        }),
        drawRightTopBanner({
          title: scene,
          scorer: s,
          assister: !!a ? `assist.${a}` : "",
          skill: !!k ? k : "",
        }),
      ])
      // .size("1920x1080")
      .size("1280x720")
      // .size("960x540")
      .audioFilter(`atempo=${playbackSpeed}`) // 오디오 속도 조절 필터
      .on("start", (commandLine) => {
        console.log(`start createVideo`, { commandLine });
      })
      .on("progress", (progress) => {
        console.log("createVideo Processing: " + progress.percent + "% done");
      })
      .on("end", () => {
        const executionTime = (performance.now() - start).toFixed(2);
        console.log(`${scene} 영상 완료 (${t})  [${executionTime}ms]`);
        resolve();
      })
      .on("error", (err) => {
        console.error(`createVideo Error`, err);
        reject(err);
      })
      .run();
  });
}

function createIntroVideo(option) {
  const playbackSpeed = 0.4;
  const { outputPath, name, record } = option;
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input("assets/intro.mp4")
      .inputOptions(["-hwaccel nvdec"])
      .inputFPS(30)
      .input("assets/Flying.mp3")
      .videoCodec("libx264")
      .audioCodec("aac")
      .output(outputPath)
      .outputOptions(["-map 0:v", "-map 1:a", "-shortest", "-c:v h264_nvenc"])
      .videoFilter([
        drawIntroBanner({ name, record }),
        `setpts=${1 / playbackSpeed}*PTS`,
      ])
      .size("1280x720")
      .audioFilter("volume=0")
      .on("start", (commandLine) => {
        console.log(`start mergeVideo`, { commandLine });
      })
      .on("progress", (progress) => {
        console.log(
          "createIntroVideo Processing: " + progress.percent + "% done"
        );
      })
      .on("end", resolve)
      .on("error", reject)
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
      .inputOptions(["-hwaccel nvdec"])
      .on("start", (commandLine) => {
        console.log(`start mergeVideo`, { commandLine });
      })
      .on("progress", (progress) => {
        console.log("mergeVideo Processing: " + progress.percent + "% done");
      })
      .on("end", () => {
        const executionTime = (performance.now() - start).toFixed(2);
        console.log(`이어붙이기 완료 [${executionTime}ms]`);
        resolve();
      })
      .on("error", (err) => {
        console.error(`mergeVideo Error`, err);
        reject(err);
      })
      // .outputOption("-c:v h264_nvenc")
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

function getRecord(playerInfo, player) {
  const record = [];
  for (let game = 1; game <= 4; game++) {
    let score = 0,
      assist = 0,
      rebound = 0;
    playerInfo.forEach(({ g, s, a, k }) => {
      if (g === game) {
        if (s === player) {
          score = score + (k === "3점슛" ? 3 : 2);
          rebound = rebound + (k === "풋백" ? 1 : 0);
        } else if (a === player) {
          assist++;
        }
      }
    });
    if (!(score === 0 && assist === 0 && rebound === 0)) {
      record.push(
        [
          `${game} 게임 | `,
          score > 0 ? `${score}득점` : "",
          assist > 0 ? `${assist}어시` : "",
          rebound > 0 ? `${rebound}리바` : "",
        ]
          .filter((v) => !!v)
          .join(" ")
      );
    }
  }
  return record;
}
