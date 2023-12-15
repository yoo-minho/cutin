import { getMatchByGameCode } from "@/server/data/gameStat";

export default defineEventHandler(async (event) => {
  const { gameCode } = getRouterParams(event);
  return await getMatchByGameCode(gameCode);
});
