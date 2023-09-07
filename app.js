import ffmpeg from "fluent-ffmpeg";
import fs from "node:fs";
import {
  drawLeftTopBanner0,
  drawLeftTopBanner1,
  drawLeftTopBanner2,
  drawRightTopBanner0,
  drawRightTopBanner1,
  drawRightTopBanner2,
} from "./text-overlay/textOverlay.js";

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

function mkdir({ parentDir, childDir }) {
  const path = `${parentDir}/${childDir}`;
  try {
    fs.mkdirSync(parentDir);
  } catch (err) {
    if (err.code === "EEXIST") {
      //pass
    } else {
      console.error("디렉터리 생성 중 오류 발생:", err);
    }
  } finally {
    try {
      fs.mkdirSync(path);
    } catch (err) {}
    return path;
  }
}

function concatenateAudio(inputPath, outputPath, repeatCount) {
  if (fs.existsSync(outputPath)) return;
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
}

const createVideo = (option) => {
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
        // `scale=(1.5*iw):-1`,
        `crop=in_w/${zoom}:in_h/${zoom}:in_w*${x}:in_h*${y}`,
        // `fps=30,scale=8000:-1,zoompan=z='pzoom+0.001':x=iw/2-(iw/zoom/2):y=ih/2-(ih/zoom/2)-360:d=1:s=1280x720:fps=30`,
        `setpts=${1 / playbackSpeed}*PTS`,
        `eq=brightness=0.15`,
        `drawtext=${drawLeftTopBanner0(title)}`,
        // `drawbox=x=36:y=36:w=200:h=40:t=fill:color=black@0.5`,
        `drawtext=${drawLeftTopBanner1(date + ` ${g}G ${q}Q`)}`,
        `drawtext=${drawLeftTopBanner2(place)}`,
        `drawtext=${drawRightTopBanner0(`Highlight #${idx + 1}`)}`,
        `drawtext=${drawRightTopBanner1(s)}`,
        `drawtext=${drawRightTopBanner2(
          [!!k ? k : "", !!a ? `ast. ${a}` : ""].filter((v) => !!v).join(" / ")
        )}`,
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
};

const mergeVideo = (option) => {
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
};

const mergeAudio = (option) => {
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

const cutVideo = async (option) => {
  const start = performance.now();
  const { gameInfo, bgmPath, videoPath, seekArr } = option;
  const { title, date } = gameInfo;

  const path = mkdir({ parentDir: title, childDir: date });
  const highlightPath = mkdir({ parentDir: path, childDir: "higlight" });
  const quaterPath = mkdir({ parentDir: path, childDir: "quater" });
  const gamePath = mkdir({ parentDir: path, childDir: "game" });
  const playerPath = mkdir({ parentDir: path, childDir: "player" });

  await concatenateAudio(bgmPath, path + "/bgm.mp3", 3);

  //#1. 하이라이트
  const highlightArr = [];
  for (const [idx, seek] of seekArr.entries()) {
    const option = {
      idx,
      inputPath: videoPath[seek.v],
      outputPath: `${highlightPath}/${idx}.mp4`,
      gameInfo,
      ...seek,
    };
    highlightArr.push(option);
    await createVideo(option);
    if (idx === 0) return;
  }

  //#2. 쿼터
  for (let game = 1; game <= 4; game++) {
    for (let quater = 1; quater <= 4; quater++) {
      const concatFileArr = highlightArr
        .filter(({ g, q }) => g === game && q === quater)
        .map((o) => o.outputPath);
      if (concatFileArr.length === 0) continue;

      const outputPath = `${quaterPath}/${game}game${quater}quater.mp4`;
      await mergeVideo({ concatFileArr, outputPath });
    }
  }

  //#3. 게임
  for (let game = 1; game <= 4; game++) {
    const concatFileArr = highlightArr
      .filter(({ g }) => g === game)
      .map((o) => o.outputPath);
    if (concatFileArr.length === 0) continue;

    const outputPath = `${gamePath}/${game}game.mp4`;
    await mergeVideo({ concatFileArr, outputPath });
    await mergeAudio({ outputPath, bgmPath });
  }

  //#4. 플레이어
  const player = [
    ...new Set(
      seekArr
        .map((v) => [v.s, v.a])
        .flat()
        .filter((v) => !!v)
    ),
  ];
  player.forEach(async (player) => {
    const concatFileArr = highlightArr
      .filter(({ s, a }) => [s, a].includes(player))
      .map((o) => o.outputPath);
    if (concatFileArr.length === 0) return;

    const outputPath = `${playerPath}/${player}.mp4`;
    await mergeVideo({ concatFileArr, outputPath });
  });

  const executionTime = (performance.now() - start).toFixed(2);
  console.log(`작업 완료 [${executionTime}ms]`);
  return seekArr.length;
};

/*
 * v : videoIndex 비디오번호
 * t : seekTime 시간
 * g : game 게임
 * q : quater 쿼터
 * s : scorers 득점선수명
 * a : assist player 어시선수명
 * k : skill 스킬이름
 */

const SKILL = {
  TP: "3점슛",
  FB: "풋백",
  FT: "자유투",
  SM: "스핀무브",
  BC: "바스켓카운트",
  FA: "페이드어웨이",
  RG: "속공",
};

await cutVideo({
  gameInfo: {
    title: "GBA",
    place: "영등포 제2스포츠센터",
    date: "20230902",
  },
  bgmPath: "assets/Flying.mp3",
  videoPath: [
    "temp/gba_20230902_1.mp4",
    "temp/gba_20230902_2.mp4",
    "temp/gba_20230902_3.mp4",
  ],
  seekArr: [
    { v: 0, g: 1, q: 1, t: "01:13", s: "김영재", a: "황지환" },
    { v: 0, g: 1, q: 1, t: "05:13", s: "김영재", a: "황지환" },
    { v: 0, g: 1, q: 1, t: "08:45", s: "김영재", a: "이도연", k: SKILL.TP },
    { v: 0, g: 1, q: 1, t: "09:45", s: "이도연", k: SKILL.FB },
    { v: 0, g: 1, q: 2, t: "12:44", s: "황지환", a: "유민호" },
    { v: 0, g: 1, q: 2, t: "13:18", s: "이도연", a: "유민호" },
    { v: 0, g: 1, q: 2, t: "14:35", s: "이도연", a: "황지환" },
    { v: 0, g: 1, q: 2, t: "16:38", s: "황지환" },
    { v: 0, g: 1, q: 2, t: "17:19", s: "이도연", k: SKILL.FB },
    { v: 0, g: 1, q: 2, t: "17:48", s: "황지환", k: SKILL.FB },
    { v: 0, g: 1, q: 2, t: "18:32", s: "황지환", k: SKILL.FB },
    { v: 0, g: 1, q: 2, t: "19:07", s: "황지환", k: SKILL.FB },
    { v: 0, g: 1, q: 2, t: "21:50", s: "유민호", k: SKILL.FT },
    { v: 0, g: 1, q: 3, t: "25:07", s: "김영재", a: "유민호", k: SKILL.TP },
    { v: 0, g: 1, q: 3, t: "28:44", s: "이도연", a: "최진홍" },
    { v: 0, g: 1, q: 3, t: "29:20", s: "유민호", a: "김영재" },
    { v: 0, g: 1, q: 3, t: "29:40", s: "최광오", a: "이도연" },
    { v: 0, g: 1, q: 3, t: "31:18", s: "최진홍", k: SKILL.FT },
    { v: 0, g: 1, q: 3, t: "32:50", s: "이도연", a: "최광오" },
    { v: 0, g: 1, q: 3, t: "33:48", s: "유민호" },
    { v: 0, g: 1, q: 4, t: "38:08", s: "황지환", a: "최광오", k: SKILL.SM },
    { v: 0, g: 1, q: 4, t: "39:00", s: "황지환", k: "풋백" },
    { v: 0, g: 1, q: 4, t: "39:33", s: "황지환", k: SKILL.FT },
    { v: 0, g: 1, q: 4, t: "40:07", s: "김영재" },
    { v: 0, g: 1, q: 4, t: "40:49", s: "최진홍", a: "최광오" },
    { v: 0, g: 1, q: 4, t: "43:36", s: "최진홍", a: "이재욱" },
    { v: 0, g: 1, q: 4, t: "44:01", s: "김영재", a: "최광오" },
    { v: 0, g: 1, q: 4, t: "45:31", s: "황지환" },
    { v: 0, g: 1, q: 4, t: "46:01", s: "김영재", a: "최광오" },
    { v: 1, g: 2, q: 1, t: "02:06", s: "최광오", a: "황지환" },
    { v: 1, g: 2, q: 1, t: "03:47", s: "이재욱", a: "최광오" },
    { v: 1, g: 2, q: 1, t: "04:03", s: "황지환" },
    { v: 1, g: 2, q: 1, t: "05:29", s: "이재욱", a: "최광오", k: SKILL.TP },
    { v: 1, g: 2, q: 1, t: "06:05", s: "황지환", a: "최광오" },
    { v: 1, g: 2, q: 1, t: "08:35", s: "이재욱", k: SKILL.FT },
    { v: 1, g: 2, q: 1, t: "09:48", s: "이도연", a: "황지환", k: SKILL.BC },
    { v: 1, g: 2, q: 1, t: "10:33", s: "이도연", a: "황지환" },
    { v: 1, g: 2, q: 2, t: "13:33", s: "황지환", a: "유민호", k: SKILL.FA },
    { v: 1, g: 2, q: 2, t: "14:40", s: "이도연", a: "최진홍" },
    { v: 1, g: 2, q: 2, t: "15:35", s: "이도연", k: SKILL.FB },
    { v: 1, g: 2, q: 2, t: "16:37", s: "이도연", a: "김영재" },
    { v: 1, g: 2, q: 2, t: "17:43", s: "황지환", a: "최진홍" },
    { v: 1, g: 2, q: 2, t: "18:27", s: "이도연", a: "최진홍" },
    { v: 1, g: 2, q: 2, t: "18:53", s: "황지환", a: "최진홍" },
    { v: 1, g: 2, q: 2, t: "19:44", s: "최진홍" },
    { v: 1, g: 2, q: 2, t: "20:32", s: "황지환", a: "최진홍", k: SKILL.BC },
    { v: 1, g: 2, q: 2, t: "22:04", s: "김영재", a: "유민호", k: SKILL.TP },
    { v: 1, g: 2, q: 2, t: "22:37", s: "유민호", a: "최진홍" },
    { v: 2, g: 2, q: 3, t: "02:16", s: "유민호", a: "최진홍", k: SKILL.SM },
    { v: 2, g: 2, q: 3, t: "03:00", s: "이재욱", a: "최진홍" },
    { v: 2, g: 2, q: 3, t: "04:46", s: "김영재", a: "최진홍" },
    { v: 2, g: 2, q: 3, t: "10:06", s: "유민호", a: "이재욱" },
    { v: 2, g: 2, q: 4, t: "14:46", s: "황지환", k: SKILL.BC },
    { v: 2, g: 2, q: 4, t: "16:08", s: "황지환", a: "이도연" },
    { v: 2, g: 2, q: 4, t: "16:53", s: "김영재" },
    { v: 2, g: 2, q: 4, t: "17:33", s: "황지환", a: "이재욱" },
    { v: 2, g: 2, q: 4, t: "18:41", s: "이재욱", k: SKILL.FB },
    { v: 2, g: 2, q: 4, t: "20:32", s: "이재욱", a: "황지환", k: SKILL.RG },
    { v: 2, g: 2, q: 4, t: "22:10", s: "이도연", k: "풋백" },
    { v: 2, g: 2, q: 4, t: "22:54", s: "이재욱", a: "최광오" },
  ],
});
