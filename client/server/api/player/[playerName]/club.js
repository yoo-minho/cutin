import { getStatGroupByClubByPlayer } from "@/server/data/gameStat";

export default defineEventHandler(async (event) => {
  const { playerName } = getRouterParams(event);
  const decPlayerName = decodeURIComponent(playerName);
  return await getStatGroupByClubByPlayer(decPlayerName);
});
