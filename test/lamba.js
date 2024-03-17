import ffmpeg from "fluent-ffmpeg";
import fs from "fs";

export const handler = async (event, context) => {
  // 입력 및 출력 파일 경로
  const inputPath = "/tmp/input.mp4";
  const outputPath = "/tmp/output.mp4";

  // 입력 파일을 Lambda 함수 임시 저장소에 복사
  fs.writeFileSync(inputPath, event.inputBase64, "base64");

  // ffmpeg 처리
  await new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .output(outputPath)
      .on("end", () => {
        resolve();
      })
      .on("error", (err) => {
        reject(err);
      })
      .run();
  });

  // 출력 파일을 읽고 base64로 인코딩하여 반환
  const outputBase64 = fs.readFileSync(outputPath, "base64");

  return outputBase64;
};
