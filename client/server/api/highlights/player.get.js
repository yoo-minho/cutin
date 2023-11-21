import { getHighlightUrlByPlayer } from "../../data/highlights";
import { mkdirSync, existsSync } from "fs";
import { mergePromise } from "@/utils/videoUtil";

export default defineEventHandler(async (event) => {
  const { clubCode, playDate, gameNo, player } = getQuery(event);
  const highlights = await getHighlightUrlByPlayer(
    clubCode,
    playDate,
    gameNo,
    player
  );
  return { highlights };
});

async function xx() {
  const playerPath = `./upload/` + `${clubCode}/${playDate}/player/`;
  const encPlayer = encodeURIComponent(player);
  const outputPath = playerPath + `${encPlayer}.mp4`;
  const inputPaths = urls
    .filter((url) => !!url)
    .map((url) => {
      const filePathArr = url.replace("/v/", "").split("-");
      return `./upload/${filePathArr.join("/")}.mp4`;
    })
    .filter((path) => existsSync(path));

  if (inputPaths.length === 0) {
    return { error: true, fileUrl: "" };
  }

  mkdirSync(playerPath, { recursive: true });
  await mergePromise({ inputPaths, outputPath });
  return {
    error: false,
    fileUrl: `/v/${clubCode}-${playDate}-player-${player}`,
  };
}
