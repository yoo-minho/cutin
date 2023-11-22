import { getGamePlayer } from "@/server/data/gamePlayer";

export default defineEventHandler(async (event) => {
  const { clubCode, playDate } = getQuery(event);
  return await getGamePlayer(clubCode, playDate);
});
