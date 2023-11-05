import { mkdirSync, unlinkSync, writeFileSync } from "fs";
import { ffmpegPromise } from "../../utils/videoUtil";

export default defineEventHandler(async (event) => {
  console.log("xxxxxxx");
  const form = await readMultipartFormData(event);

  if (!form || form.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "Image Not Found",
    });
  }

  console.log("xxxxxxx222");

  const file = form[0];
  const path = Buffer.from(form[1].data).toString();
  const pathArr = path.split("/");
  const realPath = pathArr.splice(0, [pathArr.length - 1]).join("/");
  const inputPath = "./upload/" + path + ".webm";
  const outputPath = "./upload/" + path + ".mp4";

  console.log("xxxxxxx333", realPath);

  mkdirSync("./upload/" + realPath, { recursive: true });
  console.log("xxxxxxx333", realPath);

  writeFileSync(inputPath, file.data);
  console.log("xxxxxxx444", inputPath);

  await ffmpegPromise({ inputPath, outputPath });
  console.log("xxxxxxx555", outputPath);

  unlinkSync(inputPath);
  console.log("xxxxxxx666", inputPath);

  return {
    fileUrl: `/v/${path.replace(/\//g, "-")}`,
  };
});
