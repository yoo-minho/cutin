import ffmpeg from "fluent-ffmpeg";
import { cutVideo } from "./components/video.js";
import { getArrByExcel } from "./core/excel.js";
import { changeKeyOnArr } from "./util.js";
import Jimp from "jimp";
import fs from "node:fs";

// const COL_INFO = {
//   v: "비디오명",
//   t: "시간(분:초)",
//   g: "게임",
//   q: "쿼터",
//   s: "득점선수명",
//   a: "어시선수명",
//   k: "스킬이름",
// };

// await cutVideo(
//   {
//     gameInfo: {
//       title: "GBA",
//       date: "20230902",
//       place: "영등포 제2스포츠센터",
//     },
//     bgmPath: "assets/Flying.mp3",
//     videoPath: [
//       "_input/gba_20230902_1.mp4",
//       "_input/gba_20230902_2.mp4",
//       // "_input/gba_20230902_3.mp4",
//     ],
//     seekArr: changeKeyOnArr(
//       getArrByExcel("_input/gba_20230902.xlsx"),
//       COL_INFO
//     ),
//   },
//   { step: 1 }
// );


ffmpeg()
.input("_input/gba_20230902_1.mp4")
.output('output_frames/frame%d.png')
.fps(1)
.on("progress", (progress) => {
      console.log("mergeVideo Processing: " + progress.percent + "% done");
    })
.run();

// fs.readdirSync('./output_frames').forEach(async (file) => {
//   if (file.startsWith('frame') && file.endsWith('.png')) {
//     console.log({file})
//       await filterImagesWithBall(`./output_frames/${file}`);
//   }
//   return;
// });

// async function filterImagesWithBall(imagePath) {
//   let image = await Jimp.read(imagePath);
//   let containsBall = false;

//     image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
//         let red = image.bitmap.data[idx];
//         let green = image.bitmap.data[idx + 1];
//         let blue = image.bitmap.data[idx + 2];

//         // 빨간색 영역이 감지되면 (이 값은 공의 실제 색상에 따라 조정해야 할 수 있음)
//         if (red > 200 && green < 50 && blue < 50) {
//             containsBall = true;
//         }
//     });

//     if (!containsBall) {
//       fs.rename(imagePath, imagePath.replace('.png', '_no.png'))
//     } 
//     console.log({imagePath, containsBall})
// }


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
