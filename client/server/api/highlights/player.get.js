import { getHighlightUrlByPlayer } from "../../data/highlights";

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
