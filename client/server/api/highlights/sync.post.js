import { createManyHighlight, deleteByVideo } from "../../data/highlights";

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
  if (seekArr.length === 1) {
    await deleteByVideo(videoName, seekTime);
  } else {
    await deleteByVideo(videoName);
  }
  await createManyHighlight(seekArrForCreate);
});
