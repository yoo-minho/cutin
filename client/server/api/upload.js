import { ffmpegPromise } from "../../utils/videoUtil";
import { mkdirSync, writeFileSync, unlinkSync } from "fs";

export default defineEventHandler(async (event) => {
  const form = await readMultipartFormData(event);

  if (!form || form.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "Image Not Found",
    });
  }

  const file = form[0];
  const path = Buffer.from(form[1].data).toString();
  const pathArr = path.split("/");
  const realPath = pathArr.splice(0, [pathArr.length - 1]).join("/");
  const inputPath = "./upload/" + path + ".webm";
  const outputPath = "./upload/" + path + ".mp4";

  mkdirSync("./upload/" + realPath, { recursive: true });
  writeFileSync(inputPath, file.data);
  await ffmpegPromise({ inputPath, outputPath });
  unlinkSync(inputPath);
  return {
    fileUrl: `/v/${path.replace(/\//g, "-")}`,
  };
});
