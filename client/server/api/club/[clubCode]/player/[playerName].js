import { getStatGroupByGameByClubNPlayer } from "@/server/data/gameStat";

export default defineEventHandler(async (event) => {
  const { clubCode, playerName } = getRouterParams(event);
  const decPlayerName = decodeURIComponent(playerName);
  return await getStatGroupByGameByClubNPlayer(clubCode, decPlayerName);
});
