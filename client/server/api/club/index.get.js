import { getTeams, getInfoByClubCode } from "@/server/data/gameTeam";

export default defineEventHandler(async (event) => {
  const { data: clubs } = getTeams();
  const infos = await getInfoByClubCode();
  const getInfo = (clubCode) =>
    infos.find((info) => info.clubCode === clubCode) || {};
  const returnData = clubs.map((club) => {
    const { lastPlayDate, memberCount, guestCount } = getInfo(club.id);
    return { ...club, lastPlayDate, memberCount, guestCount };
  });
  return returnData;
});
