import { mkdirSync, writeFileSync, unlinkSync } from "fs";
import { updateVideoUrl } from "../data/highlights";

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
  const videoName = Buffer.from(form[2].data).toString();
  const seekTime = Buffer.from(form[3].data).toString();
  const pathArr = path.split("/");
  const realPath = pathArr.splice(0, [pathArr.length - 1]).join("/");
  const inputPath = "./upload/" + path + ".webm";
  mkdirSync("./upload/" + realPath, { recursive: true });
  writeFileSync(inputPath, file.data);
  const videoUrl = `/v/${path.replace(/\//g, "-")}.mp4`;
  await updateVideoUrl(videoUrl, videoName, seekTime);
  return { error: false, videoUrl };
});
