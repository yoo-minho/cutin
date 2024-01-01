import { writeFileSync, mkdirSync, existsSync, unlinkSync } from "fs";

export default defineEventHandler(async (event) => {
  const form = await readMultipartFormData(event);
  if (!form || form.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "Image Not Found",
    });
  }

  const fileName = Buffer.from(form[1].data).toString();
  const filePathArr = fileName.replace(".mp4", "").split("-");
  const filePath = `./upload/${filePathArr.join("/")}.mp4`;
  const basePath = `./upload/${filePathArr.join("/")}.webm`;
  const realDir = filePathArr.splice(0, [filePathArr.length - 1]).join("/");

  mkdirSync("./upload/" + realDir, { recursive: true });
  writeFileSync(filePath, form[0].data);
  if (existsSync(basePath)) unlinkSync(basePath);

  return { error: false };
});
