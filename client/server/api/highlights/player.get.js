import { getHighlightUrlByPlayer } from "../../data/highlights";
import { mkdirSync, existsSync } from "fs";
import { mergePromise } from "@/utils/videoUtil";

export default defineEventHandler(async (event) => {
  const { clubCode, playDate, gameNo, player } = getQuery(event);
  const playerPath = `./upload/` + `${clubCode}/${playDate}/player/`;
  const encPlayer = encodeURIComponent(player);
  const outputPath = playerPath + `${encPlayer}.mp4`;

  if (false && existsSync(outputPath)) {
    return {
      fileUrl: `/v/${clubCode}-${playDate}-player-${encPlayer}`,
    };
  }

  const urls = await getHighlightUrlByPlayer(
    clubCode,
    playDate,
    gameNo,
    player
  );

  const inputPaths = urls
    .filter((url) => !!url)
    .map((url) => {
      const filePathArr = url.replace("/v/", "").split("-");
      return `./upload/${filePathArr.join("/")}.mp4`;
    })
    .filter((path) => existsSync(path));

  mkdirSync(playerPath, { recursive: true });
  await mergePromise({ inputPaths, outputPath });
  return {
    fileUrl: `/v/${clubCode}-${playDate}-player-${player}`,
  };
});
