import prisma from "./prisma";

export async function getHighlightBySeekTime(videoName, seekTime) {
  return await prisma.highlight.findMany({
    where: { videoName, seekTime },
  });
}

export async function getHighlightByVideo(videoName) {
  const highlights = await prisma.highlight.findMany({
    include: { mainTeam: { select: { teamName: true } } },
    where: { videoName },
    orderBy: [{ gameNo: "asc" }, { quaterNo: "asc" }, { seekTime: "asc" }],
  });
  return highlights.map(({ mainTeam, ...rest }) => ({
    ...rest,
    team: mainTeam?.teamName,
    skill: rest.skill || "득점&어시",
  }));
}

export async function getHighlightByVideoByGameNo(clubCode, playDate, gameNo) {
  const highlights = await prisma.highlight.findMany({
    include: { mainTeam: { select: { teamName: true } } },
    where: {
      clubCode,
      playDate,
      gameNo: +gameNo,
    },
    orderBy: [{ gameNo: "asc" }, { quaterNo: "asc" }, { seekTime: "asc" }],
  });
  return highlights
    .filter((v) => !["쿼터시작", "쿼터끝"].includes(v.skill))
    .map((v) => {
      const { mainTeam, ...rest } = v;
      return {
        ...rest,
        team: mainTeam?.teamName,
        skill: rest.skill || "득점&어시",
      };
    });
}

export async function getHighlightUrlByPlayer(clubCode, playDate, gameNo, player) {
  return await prisma.highlight.findMany({
    select: { videoUrl: true, skill: true, mainPlayer: true },
    where: {
      clubCode,
      playDate,
      gameNo: +gameNo,
      OR: [{ mainPlayer: player }, { subPlayer: player }],
    },
    orderBy: [{ gameNo: "asc" }, { quaterNo: "asc" }, { seekTime: "asc" }],
  });
}

export async function createManyHighlight(data) {
  const highlights = await prisma.highlight.createMany({
    data,
  });
  return highlights;
}

export async function updateVideoUrl(updateData, whereData) {
  const { videoUrl, duration } = updateData;
  const { videoName, seekTime } = whereData;
  await prisma.highlight.update({
    data: { videoUrl, duration },
    where: { videoName_seekTime: { videoName, seekTime } },
  });
}

export async function deleteByVideo(videoName, seekTime) {
  await prisma.highlight.deleteMany({
    where: seekTime ? { videoName, seekTime } : { videoName },
  });
}
