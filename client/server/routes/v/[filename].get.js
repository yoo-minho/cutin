import { existsSync, readFileSync, unlinkSync, writeFileSync } from "fs";
import { fetch } from "node-fetch";
import { ffmpegPromise, ffprobePromise, convertLocal } from "@/utils/videoUtil";

const DOMAIN = "https://cutin.cc";

const TEMP_INPUT_PATH = "./upload/temp/input_temp.mp4";
const TEMP_OUTPUT_PATH = "./upload/temp/ouput_temp.mp4";

export default defineEventHandler(async (event) => {
  const { filename } = event.context.params; //ex) filename = gba-20231007-1g1q-00136_1_A
  const { compile } = getQuery(event); //ex) no

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
    const isLocal = reqUrl.indexOf("http://localhost:3000/") === 0;

    if (isLocal) {
      const response = await fetch(`${DOMAIN}/v/${filename}?compile=no`);
      if (response.ok) {
        writeFileSync(
          TEMP_INPUT_PATH,
          Buffer.from(await response.arrayBuffer())
        );

        const codecName = await getCodecName(TEMP_INPUT_PATH);
        if ("h264" === codecName) {
          buffer = readFileSync(TEMP_INPUT_PATH);
        } else {
          const path = TEMP_INPUT_PATH;
          switch (codecName) {
            case "hevc":
              buffer = await convertLocalNUdt({ path, filename, speed: 1 });
              break;
            case "vp9":
              buffer = await convertLocalNUdt({ path, filename, speed: 2.5 });
              break;
            default:
              break;
          }
        }

        if (!buffer) return "No File";
      } else {
        return "No File";
      }
    } else {
      return "No File";
    }
  } else {
    if (compile === "no") {
      buffer = readFileSync(existsOld ? oldFilePath : newFilePath);
    } else {
      if (existsOld) {
        await ffmpegPromise({
          inputPath: oldFilePath,
          outputPath: newFilePath,
        });
        unlinkSync(oldFilePath);
      }
      buffer = readFileSync(newFilePath);
    }
  }

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

async function convertLocalNUdt({ path, speed, filename }) {
  const outputPath = TEMP_OUTPUT_PATH;
  await convertLocal({ inputPath: path, outputPath, speed });
  const buffer = readFileSync(outputPath);
  const blob = new Blob([buffer], { type: "application/octet-stream" });
  const body = new FormData();
  body.append("file", blob);
  body.append("filename", filename);
  const fileUpdateUrl = `${DOMAIN}/api/upload/update`;
  await fetch(fileUpdateUrl, { method: "POST", body });
  return buffer;
}
