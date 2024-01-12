import {
  createManyHighlight,
  deleteByVideo,
  getHighlightBySeekTime,
} from "../../data/highlights";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { videoName, seekTime, seekArr } = body;
  const [clubCode, playDate] = videoName.split("_");
  const seekArrForCreate = seekArr.map((seek) => {
    const { gameNo, quaterNo, seekTime, skill } = seek;
    const { mainPlayer, subPlayer, videoUrl } = seek;
    return {
      ...{ videoName, seekTime, clubCode, playDate },
      ...{ gameNo: +gameNo, quaterNo: +quaterNo },
      ...{ mainPlayer, subPlayer, skill, videoUrl },
    };
  });
  if (seekArrForCreate.length === 1) {
    const newTime = seekArrForCreate[0].seekTime;
    if (seekTime !== newTime) {
      const highlight = await getHighlightBySeekTime(videoName, newTime);
      if (highlight.length > 0) {
        throw createError({
          statusCode: 409,
          statusMessage: "이미 기록된 시간입니다",
        });
      }
    }
    await deleteByVideo(videoName, seekTime);
  } else {
    await deleteByVideo(videoName);
  }
  await createManyHighlight(seekArrForCreate);
});
