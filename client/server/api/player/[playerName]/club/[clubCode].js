import { getStatByClubNPlayer } from "@/server/data/gameStat";

export default defineEventHandler(async (event) => {
  const { playerName, clubCode } = getRouterParams(event);
  const decPlayerName = decodeURIComponent(playerName);
  return await getStatByClubNPlayer(decPlayerName, clubCode);
});
