import ffmpeg from "fluent-ffmpeg";
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
      "_input/gba_20230902_3.mp4",
    ],
    seekArr: changeKeyOnArr(
      getArrByExcel("_input/gba_20230902.xlsx"),
      COL_INFO
    ),
  },
  { step: 1 }
);

// const xxx = changeKeyOnArr(getArrByExcel("_input/gba_20230902.xlsx"), COL_INFO);
// const inputPath = "_input/gba_20230902_1.mp4";
// const ff = ffmpeg().input(inputPath).inputOptions(["-hwaccel nvdec"]);

// xxx.forEach(({ t }, i) => {
//   ff.output(`temp/${i}.mp4`)
//     .seek(t)

//     .duration("00:06")
//     .size("1280x720")
//     .videoFilter([`setpts=${1 / 1.5}*PTS`]);
// });

// ff.on("end", function () {
//   console.log("변환이 완료되었습니다.");
// })
//   .on("error", function (err) {
//     console.error("오류 발생: " + err);
//   })
//   .on("start", (commandLine) => {
//     console.log(`start mergeVideo`, { commandLine });
//   })
//   .on("progress", (progress) => {
//     console.log("mergeVideo Processing: " + progress.percent + "% done");
//   })
//   .run();
