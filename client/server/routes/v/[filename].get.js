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

  // 파일이 존재하는지 확인
  if (existsSync(newFilePath)) {
    //pass
  } else if (existsSync(oldFilePath)) {
    await ffmpegPromise({ inputPath: oldFilePath, outputPath: newFilePath });
    unlinkSync(oldFilePath);
  } else {
    setResponseStatus(event, 404);
    return "No File";
  }

  // 응답 헤더 설정
  setHeader(event, "cache-control", "no-cache");
  setHeader(event, "connection", "keep-alive");
  setHeader(
    event,
    "Content-Disposition",
    `attachment; filename="${newFileName}`
  );
  setHeader(event, "content-type", "application/octet-stream");
  const buffer = readFileSync(newFilePath);
  return buffer;
});
