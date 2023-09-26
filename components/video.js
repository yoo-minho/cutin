import ffmpeg from "fluent-ffmpeg";
import { makeFolder } from "../util.js";
import { ffmpegPromise, cutFunc, chunkArray } from "./videoUtil.js";
import { drawIntroBanner, drawBanners } from "./textOverlay.js";

export const cutVideo = async (option, { step = 1 } = {}) => {
  const start = performance.now();
  const { gameInfo, bgmPath, videoPath, seekArr } = option;
  const { title, date } = gameInfo;

  const _path = makeFolder({ parentDir: `_output/${title}`, childDir: date });
  const highlightPath = makeFolder({ parentDir: _path, childDir: "highlight" });
  const gamePath = makeFolder({ parentDir: _path, childDir: "game" });
  const playerPath = makeFolder({ parentDir: _path, childDir: "player" });

  // if (!existsFile(path + "/bgm.mp3")) {
  //   await concatenateAudio(bgmPath, path + "/bgm.mp3", 3);
  // }

  //#1. 하이라이트
  const splitCount = 4;
  const avgSecond = 7;

  console.log(
    "예상소요시간 : " +
      Math.round((((seekArr.length / splitCount) * avgSecond) / 60) * 100) /
        100 +
      "분"
  );

  const _seekArr = seekArr.map((v, i) => ({ index: i, ...v }));

  const highlightArr = [];
  for (const [idx, chunk] of chunkArray(_seekArr, splitCount).entries()) {
    await Promise.all(
      chunk.map((seek) => {
        const option = {
          idx: seek.index,
          inputPath: videoPath.find((v) => v.includes(seek.v)),
          outputPath: `${highlightPath}/${seek.index}.mp4`,
          gameInfo,
          ...seek,
        };
        highlightArr.push(option);
        if (step === 1 || step === 0) {
          return createVideo(option);
        }
      })
    );
  }

  if (step === 2 || step === 0) {
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
      const concatFileArr = [...playerInfo]
        .map((p) => ({ ...p, idx: String(p.g) + String(p.q) }))
        .sort((a, b) => a.idx - b.idx)
        .map((o) => o.outputPath);

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

async function createVideo(option) {
  const start = performance.now();
  const { inputPath, outputPath, gameInfo, idx } = option;
  const { g, q, s, a, k, t } = option;
  const scene = `#${idx + 1}`;
  const { title, date, place } = gameInfo;
  const banners = drawBanners({ scene, title, date, place, g, q, s, a, k });

  await ffmpegPromise({
    inputPath,
    outputPath,
    func: cutFunc({
      time: calculateTimeBefore(`00:${t}`, 9 - 1),
      duration: 9,
      speed: 1.8,
      func: (ff) => ff.videoFilter(banners),
    }),
  });

  console.log(
    `${scene} 영상 완료 (${t})  [${(performance.now() - start).toFixed(2)}ms]`
  );
}

function createIntroVideo(option) {
  const playbackSpeed = 0.4;
  const { outputPath, name, record } = option;
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input("assets/intro.mp4")
      .inputFPS(30)
      .input("assets/Flying.mp3")
      .videoCodec("libx264")
      .audioCodec("aac")
      .output(outputPath)
      .outputOptions(["-map 0:v", "-map 1:a", "-shortest"])
      .videoFilter([
        drawIntroBanner({ name, record }),
        `setpts=${1 / playbackSpeed}*PTS`,
      ])
      .size("1280x720")
      .audioFilter("volume=0")
      .on("start", (commandLine) => {
        // console.log(`start mergeVideo`, { commandLine });
      })
      .on("progress", (progress) => {
        // console.log(
        //   "createIntroVideo Processing: " + progress.percent + "% done"
        // );
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
      .on("start", (commandLine) => {
        // console.log(`start mergeVideo`, { commandLine });
      })
      .on("progress", (progress) => {
        // console.log("mergeVideo Processing: " + progress.percent + "% done");
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
      if (+g === game) {
        if (s === player) {
          score = score + (k === "3점슛" ? 3 : 2);
          rebound = rebound + (k === "풋백" ? 1 : 0);
        } else if (a === player) {
          assist++;
          rebound = rebound + (k === "오펜스리바" ? 1 : 0);
        }
      }
    });
    if (!(score === 0 && assist === 0 && rebound === 0)) {
      record.push(
        [
          `${game} 게임 | `,
          score > 0 ? `${score}득점` : "",
          assist > 0 ? `${assist}어시` : "",
          rebound > 0 ? `${rebound}오펜스리바` : "",
        ]
          .filter((v) => !!v)
          .join(" ")
      );
    }
  }
  return record;
}

// 해밍 거리 계산 함수
function hammingDistance(hashA, hashB) {
  if (hashA.length !== hashB.length) {
    throw new Error("해시값 길이가 다릅니다.");
  }

  let distance = 0;

  for (let i = 0; i < hashA.length; i++) {
    if (hashA[i] !== hashB[i]) {
      distance++;
    }
  }

  return distance;
}
