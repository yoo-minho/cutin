import { writeFileSync, mkdirSync } from "fs";

export default defineEventHandler(async (event) => {
  const form = await readMultipartFormData(event);
  if (!form || form.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "Image Not Found",
    });
  }
  const file = form[0];
  const fileName = Buffer.from(form[1].data).toString();
  const filePathArr = fileName.replace(".mp4", "").split("-");
  const filePath = `./upload/${filePathArr.join("/")}.mp4`;
  const realDir = filePathArr.splice(0, [filePathArr.length - 1]).join("/");
  mkdirSync("./upload/" + realDir, { recursive: true });
  writeFileSync(filePath, file.data);
  return { error: false };
});
