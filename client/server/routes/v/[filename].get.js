import { existsSync, readFileSync, unlinkSync, writeFileSync } from "fs";
import { fetch } from "node-fetch";
import { ffmpegPromise, ffprobePromise, convertH265 } from "@/utils/videoUtil";

export default defineEventHandler(async (event) => {
  const { filename } = event.context.params;
  //ex) filename = gba-20231007-1g1q-00136_1_A
  const { compile } = getQuery(event);
  //ex) no

  // 파일 경로 및 이름 설정
  const filePathArr = filename.replace(".mp4", "").split("-");
  const newFileName = filePathArr[filePathArr.length - 1] + ".mp4";
  const oldFilePath = `./upload/${filePathArr.join("/")}.webm`;
  const newFilePath = `./upload/${filePathArr.join("/")}.mp4`;

  const existsNew = existsSync(newFilePath);
  const existsOld = existsSync(oldFilePath);

  let buffer;
  if (!existsNew && !existsOld) {
    const reqUrl = String(getRequestURL(event)); //ex) http://localhost:3000/v/gba-20231230-2g2q-00450_B_2.mp4

    if (reqUrl.indexOf("http://localhost:3000/") === 0) {
      const fileUrl = `https://cutin.cc/v/${filename}?compile=no`;
      const response = await fetch(fileUrl);
      if (response.ok) {
        const inputTempPath = "./upload/temp/input_temp.mp4";
        const outputTempPath = "./upload/temp/ouput_temp.mp4";

        writeFileSync(inputTempPath, Buffer.from(await response.arrayBuffer()));

        const codecName = await getCodecName(inputTempPath);
        console.log("codec_name", codecName);

        const covertInfo = {
          inputPath: inputTempPath,
          outputPath: outputTempPath,
          filename,
        };

        switch (codecName) {
          case "hevc":
            buffer = readFileSync(outputPath);
            break;
          case "h264":
            buffer = await convertH265NUpdate({ ...covertInfo, speed: 1 });
            break;
          case "vp9":
            buffer = await convertH265NUpdate({ ...covertInfo, speed: 2.5 });
            break;
          default:
            break;
        }

        if (!buffer) return "No File";
      } else {
        return "No File";
      }
    } else {
      return "No File";
    }
  } else {
    console.log("xxxx22", { compile });

    if (existsOld && compile !== "no") {
      const codecName = await getCodecName(oldFilePath);
      console.log("codec_name 11", codecName);

      await ffmpegPromise({ inputPath: oldFilePath, outputPath: newFilePath });
      unlinkSync(oldFilePath);
    }

    const codecName2 = await getCodecName(newFilePath);
    console.log("codec_name 22", codecName2);
    buffer = readFileSync(newFilePath);
  }

  // 응답 헤더 설정
  setHeader(event, "cache-control", "no-cache");
  setHeader(event, "connection", "keep-alive");
  setHeader(
    event,
    "Content-Disposition",
    `attachment; filename="${newFileName}`
  );
  setHeader(event, "content-type", "video/mp4");

  return buffer;
});

async function getCodecName(path) {
  const metadata = await ffprobePromise(path);
  return metadata.streams[0].codec_name;
}

async function convertH265NUpdate({ inputPath, outputPath, speed, filename }) {
  await convertH265({ inputPath, outputPath, speed });
  const buffer = readFileSync(outputPath);
  const blob = new Blob([buffer], { type: "application/octet-stream" });
  const body = new FormData();
  body.append("file", blob);
  body.append("filename", filename);
  const fileUpdateUrl = `http://localhost:3000/api/upload/update`;
  await fetch(fileUpdateUrl, { method: "POST", body });
  return buffer;
}
