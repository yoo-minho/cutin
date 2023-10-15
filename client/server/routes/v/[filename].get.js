import { existsSync, readFileSync } from "fs";

export default defineEventHandler(async (event) => {
  const { filename } = event.context.params;

  //ex) filename = http://localhost:3000/v/gba-20231007-1g1q-00136_1_A
  //ex) filename = ./upload/gba/20231007/1g1q/00136_1_A.mp4

  // 파일 경로 및 이름 설정
  const filePathArr = filename.split("-");
  const fileName = filePathArr[filePathArr.length - 1] + ".mp4";
  const filePath = `./upload/${filePathArr.join("/")}.mp4`;

  // 파일이 존재하는지 확인
  if (!existsSync(filePath)) {
    setResponseStatus(event, 404);
    return "No File";
  } else {
    console.log("파일있어!");
  }

  // 응답 헤더 설정
  setHeader(event, "cache-control", "no-cache");
  setHeader(event, "connection", "keep-alive");
  setHeader(event, "Content-Disposition", `attachment; filename="${fileName}`);
  setHeader(event, "content-type", "application/octet-stream");
  const buffer = readFileSync(filePath);
  return buffer;
});
