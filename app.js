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

const conv = (jsonFileName) =>
  JSON.parse(fs.readFileSync(jsonFileName, "utf8")).map((v) => {
    const [g, q] = v.game.split(/g|q/);
    return { ...v, g, q };
  });

const teamName = "gba";
const date = "20230923";
const videoSet = ["1_A", "2_A", "3_A", "4_A", "5_A", "1_B", "2_B"];
const videoPathPrefix = `_input/${teamName}/${date}`;
const videoPath = videoSet.map(
  (v) => `${videoPathPrefix}/${teamName}_${date}_${v}.mp4`
);
const seekArr = changeKeyOnArr(
  videoSet
    .map((v) => conv(`${videoPathPrefix}/${teamName}_${date}_${v}.json`))
    .flat(),
  COL_INFO_V2
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
  { step: 0 }
);
