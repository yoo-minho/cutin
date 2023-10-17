import { getGamePlayer } from "~/server/data/gamePlayer";

export default defineEventHandler(async (event) => {
  const { videoCode } = getQuery(event);
  const [clubCode, playDate] = videoCode.split("_");
  return await getGamePlayer(clubCode, playDate);
});
