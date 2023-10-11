import { writeFile } from "fs/promises";

export default defineEventHandler(async (event) => {
  const files = await readMultipartFormData(event);

  if (!files || files.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "Image Not Found",
    });
  }

  for (let i = 0; i < files.length; i++) {
    if (files[i].name === "file") {
      const filename = files[i].filename;
      //   const mimetype = files[i].type;
      const data = files[i].data;
      const filePath = `./public/${filename}`;
      await writeFile(filePath, data);
    }
  }
  return {
    message: "success",
  };
});
