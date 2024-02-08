import { writeFileSync } from "fs";

export default defineEventHandler(async (event) => {
  console.log("yyyyy 000");
  const form = await readMultipartFormData(event);

  if (!form || form.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "Image Not Found",
    });
  }
  const file = form[0].data;
  const inputPath = "xxx.mp4";
  writeFileSync(inputPath, file);
  ffmpegPromise(inputPath, "yyy.mp4");
});
