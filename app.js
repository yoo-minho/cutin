import { cutVideo } from "./components/video.js";
import { getArrByExcel } from "./core/excel.js";
import { changeKeyOnArr } from "./util.js";

const COL_INFO = {
  v: "비디오명",
  t: "시간(분:초)",
  g: "게임",
  q: "쿼터",
  s: "득점선수명",
  a: "어시선수명",
  k: "스킬이름",
};

await cutVideo(
  {
    gameInfo: {
      title: "GBA",
      date: "20230902",
      place: "영등포 제2스포츠센터",
    },
    bgmPath: "assets/Flying.mp3",
    videoPath: [
      "_input/gba_20230902_1.mp4",
      "_input/gba_20230902_2.mp4",
      // "_input/gba_20230902_3.mp4",
    ],
    seekArr: changeKeyOnArr(
      getArrByExcel("_input/gba_20230902.xlsx"),
      COL_INFO
    ),
  },
  { step: 1 }
);
