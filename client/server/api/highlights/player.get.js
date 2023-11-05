import { getHighlightUrlByPlayer } from "../../data/highlights";

export default defineEventHandler(async (event) => {
  const { clubCode, playDate, gameNo, player } = getQuery(event);
  const data = await getHighlightUrlByPlayer(
    clubCode,
    playDate,
    gameNo,
    player
  );
  console.log({ data });
  // await mergePromise({
  //   inputPaths: data,
  //   outputPath: "",
  // });
  return data;
});
