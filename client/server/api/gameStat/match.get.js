import { getMatchByClubCode, getMatchByGameCode } from "@/server/data/gameStat";

export default defineEventHandler(async (event) => {
  const { clubCode, gameCode } = getQuery(event);
  if (gameCode) {
    return await getMatchByGameCode(gameCode);
  }
  return await getMatchByClubCode(clubCode);
});
