import prisma from "./prisma";

export async function getGamePlayer(clubCode, playDate) {
  const highlights = await prisma.gamePlayer.findMany({
    where: { clubCode, playDate },
    orderBy: { player: "asc" },
  });
  for (const h of highlights) {
    if (!h.player) continue;
    const data = await prisma.highlight.groupBy({
      by: ["playDate"],
      _count: true,
      where: {
        clubCode,
        OR: [{ mainPlayer: h.player }, { subPlayer: h.player }],
      },
    });
    const countArray = data.map((item) => item._count);
    const totalCount = countArray.reduce((sum, count) => sum + count, 0);
    h.avgCount = countArray.length === 0 ? 0 : totalCount / countArray.length;
  }

  highlights.sort((a, b) => Math.round(b.avgCount) - Math.round(a.avgCount));
  return highlights;
}

export async function createManyGamePlayer(dataArr) {
  const _dataArr = dataArr.map((v) => ({
    clubCode: v.clubCode,
    playDate: v.playDate,
    teamName: v.teamName,
    player: v.player,
  }));
  const gamePlayer = await prisma.gamePlayer.createMany({
    data: _dataArr,
  });
  return gamePlayer;
}

export async function deleteGamePlayer(clubCode, playDate, teamName, player) {
  console.log("xxx", prisma.gamePlayers1);
  await prisma.gamePlayer.deleteMany({
    where: { clubCode, playDate, teamName, player },
  });
}
