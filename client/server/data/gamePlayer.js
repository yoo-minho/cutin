import prisma from "./prisma";

export async function getGamePlayer(clubCode, playDate) {
  const highlights = await prisma.gamePlayer.findMany({
    where: { clubCode, playDate },
    orderBy: [{ player: "asc" }],
  });
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
  await prisma.gamePlayer.deleteMany({
    where: { clubCode, playDate, teamName, player },
  });
}
