import { createManyHighlight } from "../../data/highlights";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { videoName, seekArr } = body;
  const [clubCode, playDate] = videoName.split("_");
  const seekArrForCreate = seekArr.map((seek) => {
    const { gameNo, quaterNo, seekTime } = seek;
    return {
      clubCode,
      playDate,
      gameNo: +gameNo,
      quaterNo: +quaterNo,
      seekTime: seekTime,
      skill: "",
      mainPlayer: "",
      subPlayer: "",
      videoName,
      videoUrl: "",
    };
  });
  await createManyHighlight(seekArrForCreate);
});
