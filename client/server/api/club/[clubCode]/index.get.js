import { getTeams } from "@/server/data/gameTeam";

export default defineEventHandler(async (event) => {
  const { clubCode } = getRouterParams(event);
  const { data: club } = getTeams(clubCode);
  return club;
});
