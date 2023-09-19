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
  JSON.parse(fs.readFileSync(`_input/${jsonFileName}`, "utf8")).map((v) => {
    const [g, q] = v.game.split(/g|q/);
    return { ...v, g, q };
  });

await cutVideo(
  {
    gameInfo: {
      title: "GBA",
      date: "20230916",
      place: "영등포 제2스포츠센터",
    },
    bgmPath: "assets/Flying.mp3",
    videoPath: [
      "_input/gba_20230916_1_A.mp4",
      "_input/gba_20230916_1_B.mp4",
      "_input/gba_20230916_2_A.mp4",
      "_input/gba_20230916_2_B.mp4",
    ],
    seekArr: changeKeyOnArr(
      [
        ...conv("gba_20230916_1_A.json"),
        ...conv("gba_20230916_1_B.json"),
        ...conv("gba_20230916_2_A.json"),
        ...conv("gba_20230916_2_B.json"),
      ],
      COL_INFO_V2
    ),
  },
  { step: 1 }
);
