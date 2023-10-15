import { createManyHighlight, deleteByVideo } from "../../data/highlights";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { videoName, seekArr } = body;
  const [clubCode, playDate] = videoName.split("_");
  const seekArrForCreate = seekArr.map((seek) => {
    let gameNo, quaterNo;
    if (seek.game) {
      const arr = seek.game.split(/g|q/g, 2);
      gameNo = arr[0];
      quaterNo = arr[1];
    } else {
      gameNo = seek.gameNo;
      quaterNo = seek.quaterNo;
    }
    return {
      clubCode,
      playDate,
      gameNo: +gameNo,
      quaterNo: +quaterNo,
      seekTime: seek.time || seek.seekTime,
      skill: seek.skill,
      mainPlayer: seek.scorer || seek.mainPlayer,
      subPlayer: seek.assister || seek.subPlayer,
      videoName,
      videoUrl: seek.videoUrl || "",
    };
  });
  if (seekArr.length === 1) {
    await deleteByVideo(videoName, seekArr[0].seekTime);
  } else {
    await deleteByVideo(videoName);
  }
  await createManyHighlight(seekArrForCreate);
});
