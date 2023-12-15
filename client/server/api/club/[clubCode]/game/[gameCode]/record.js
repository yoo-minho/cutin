import { getGamePlayer } from "@/server/data/gamePlayer";
import { getHighlightByVideoByGameNo } from "@/server/data/highlights";
import { getSkillPoints } from "@/composables/constants";

export default defineEventHandler(async (event) => {
  const { gameCode } = getRouterParams(event);
  const [clubCode, playDate, gameNo] = gameCode.split("_");
  const playerArr = await getGamePlayer(clubCode, playDate);
  const cuts = await getHighlightByVideoByGameNo(clubCode, playDate, gameNo);
  const [teamName1, teamName2] = getUniqueTeamNames(playerArr);

  const initializePlayerStats = () => ({
    pts: 0,
    tpm: 0,
    ast: 0,
    reb: 0,
    orb: 0,
    blk: 0,
    stl: 0,
  });

  const playerStatsMap = new Map();

  playerArr
    .filter((player) => !!player.player)
    .forEach((player) => {
      playerStatsMap.set(player.player, {
        name: player.player,
        team: player.teamName,
        ...initializePlayerStats(),
      });
    });

  cuts.forEach((cut) => {
    const { skill, mainPlayer, subPlayer } = cut;
    const { main, sub } = getSkillPoints(skill);

    updatePlayerStats(mainPlayer, main);
    updatePlayerStats(subPlayer, sub);

    function updatePlayerStats(playerName, skillPoints) {
      const playerStats = playerStatsMap.get(playerName);
      if (!playerStats) return;
      Object.keys(initializePlayerStats()).forEach((stat) => {
        playerStats[stat] += skillPoints[stat] || 0;
      });
    }
  });

  const getPlayerStatsByTeam = (teamName) => {
    const teamPlayerStats = Array.from(playerStatsMap.values())
      .filter((player) => player.team === teamName)
      .map((player) => ({ ...player, kbl: getKblEff(player) }));

    return [
      ...teamPlayerStats.sort((a, b) => b.kbl - a.kbl),
      {
        name: "전체",
        pts: sumRecord(teamPlayerStats, "pts"),
        tpm: sumRecord(teamPlayerStats, "tpm"),
        ast: sumRecord(teamPlayerStats, "ast"),
        reb: sumRecord(teamPlayerStats, "reb"),
        orb: sumRecord(teamPlayerStats, "orb"),
        blk: sumRecord(teamPlayerStats, "blk"),
        stl: sumRecord(teamPlayerStats, "stl"),
      },
    ];
  };

  return [
    { teamName: teamName1, playerStat: getPlayerStatsByTeam(teamName1) },
    { teamName: teamName2, playerStat: getPlayerStatsByTeam(teamName2) },
  ].sort((a, b) => a.teamName.localeCompare(b.teamName));
});

function sumRecord(teamPlayerStats, stat) {
  return teamPlayerStats.reduce((total, player) => total + player[stat], 0);
}

function getUniqueTeamNames(data) {
  return [...new Set(data.map((item) => item.teamName))];
}

function getKblEff(v) {
  return (
    (v.pts + v.stl + v.blk + (v.reb - v.orb)) * 1.0 + (v.orb + v.ast) * 1.5
  );
}
