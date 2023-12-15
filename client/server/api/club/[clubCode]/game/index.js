import { getMatchByClubCode } from "@/server/data/gameStat";

export default defineEventHandler(async (event) => {
  const { clubCode } = getRouterParams(event);
  return await getMatchByClubCode(clubCode);
});
