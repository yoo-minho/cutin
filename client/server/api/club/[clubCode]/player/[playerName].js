import { getStatGroupByGameByClubNPlayer } from "@/server/data/gameStat";

export default defineEventHandler(async (event) => {
  const { clubCode, playerName } = getRouterParams(event);
  const decPlayerName = decodeURIComponent(playerName);
  const stats = await getStatGroupByGameByClubNPlayer(clubCode, decPlayerName);
  return stats;
});
