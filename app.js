import { cutVideo } from "./components/video.js";
import { changeKeyOnArr } from "./util.js";
import fs from "node:fs";

const COL_INFO_V2 = {
  v: "videoName",
  t: "time",
  g: "g",
  q: "q",
  s: "scorer",
  a: "assister",
  k: "skill",
};

const COL_INFO_V3 = {
  v: "videoName",
  t: "seekTime",
  g: "gameNo",
  q: "quaterNo",
  s: "mainPlayer",
  a: "subPlayer",
  k: "skill",
};

const conv = (jsonFileName) =>
  JSON.parse(fs.readFileSync(jsonFileName, "utf8"));

const teamName = "gba";
const date = "20231007";
const videoSet = ["1_A", "2_A", "1_B", "2_B"];
const videoPathPrefix = `_input/${teamName}/${date}`;
const videoPath = videoSet.map(
  (v) => `${videoPathPrefix}/${teamName}_${date}_${v}.mp4`
);
const seekArr = changeKeyOnArr(
  videoSet
    .map((v) => conv(`${videoPathPrefix}/${teamName}_${date}_${v}.json`))
    .flat(),
  COL_INFO_V3
);

await cutVideo(
  {
    gameInfo: {
      title: teamName.toUpperCase(),
      date,
      place: "영등포 제2스포츠센터",
    },
    bgmPath: "assets/Flying.mp3",
    videoPath,
    seekArr,
  },
  { step: 2 }
);
