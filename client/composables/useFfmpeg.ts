import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import type { LogEvent } from "@ffmpeg/ffmpeg/dist/esm/types";

export async function getUrl(inputFilePath: string) {
  console.log({ inputFilePath });
  const baseURL = "https://unpkg.com/@ffmpeg/core-mt@0.12.3/dist/esm";
  console.log(-1);
  const ffmpeg = new FFmpeg();
  ffmpeg.on("log", ({ message: msg }: LogEvent) => {
    console.log("xxx", msg);
  });
  console.log(0);
  const coreBlobURL = await toBlobURL(
    "_nuxt/lib/ffmpeg/ffmpeg-core.js",
    "text/javascript"
  );
  console.log("coreBlobURL:", coreBlobURL);

  const wasmBlobURL = await toBlobURL(
    "/_nuxt/lib/ffmpeg/ffmpeg-core.wasm",
    "application/wasm"
  );
  console.log("wasmBlobURL:", wasmBlobURL);

  const workerBlobURL = await toBlobURL(
    "/_nuxt/lib/ffmpeg/ffmpeg-core.worker.js",
    "text/javascript"
  );
  console.log("workerBlobURL:", workerBlobURL);

  try {
    await ffmpeg.load({
      coreURL: coreBlobURL,
      wasmURL: wasmBlobURL,
      workerURL: workerBlobURL,
    });
  } catch (e) {
    console.log("zxczxc", e);
  }

  console.log(1);
  const outputFilePath = "output.mp4";
  const startTime = 10;
  const endTime = 16;
  await ffmpeg.writeFile("input.mp4", await fetchFile(inputFilePath));
  console.log(2);
  await ffmpeg.exec([
    "-i",
    "input.mp4",
    "-ss",
    `${startTime}`,
    "-t",
    `${endTime - startTime}`,
    "-c:v",
    "copy",
    "-c:a",
    "copy",
    outputFilePath,
  ]);
  console.log(3);
  const data = (await ffmpeg.readFile(outputFilePath)) as Uint8Array;
  const url = URL.createObjectURL(
    new Blob([data.buffer], { type: "video/mp4" })
  );
  return url;
}
