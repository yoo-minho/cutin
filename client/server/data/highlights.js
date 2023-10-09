import prisma from "./prisma";

export async function getHighlightByVideo(videoName) {
  const highlights = await prisma.highlight.findMany({
    where: { videoName },
    orderBy: [{ gameNo: "asc" }, { quaterNo: "asc" }, { seekTime: "asc" }],
  });
  return highlights;
}

export async function createManyHighlight(data) {
  const highlights = await prisma.highlight.createMany({
    data,
  });
  return highlights;
}

export async function deleteByVideo(videoName, seekTime) {
  await prisma.highlight.deleteMany({
    where: seekTime ? { videoName, seekTime } : { videoName },
  });
}
