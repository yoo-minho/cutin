import { existsSync, readFileSync, unlinkSync } from "fs";
import { ffmpegPromise } from "@/utils/videoUtil";

export default defineEventHandler(async (event) => {
  const { filename } = event.context.params;

  //ex) filename = http://localhost:3000/v/gba-20231007-1g1q-00136_1_A
  //ex) filename = ./upload/gba/20231007/1g1q/00136_1_A.mp4

  // 파일 경로 및 이름 설정
  const filePathArr = filename.replace(".mp4", "").split("-");
  const newFileName = filePathArr[filePathArr.length - 1] + ".mp4";
  const oldFilePath = `./upload/${filePathArr.join("/")}.webm`;
  const newFilePath = `./upload/${filePathArr.join("/")}.mp4`;

  const existsNew = existsSync(newFilePath);
  const existsOld = existsSync(oldFilePath);

  if (!existsNew && !existsOld) {
    return "No File";
  }

  const buffer = readFileSync(existsNew ? newFilePath : oldFilePath);

  if (existsOld) {
    // await ffmpegPromise({ inputPath: oldFilePath, outputPath: newFilePath });
    // unlinkSync(oldFilePath);
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
