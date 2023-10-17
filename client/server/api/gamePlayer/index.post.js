import { createManyGamePlayer } from "~/server/data/gamePlayer";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { videoCode, playerArr } = body;
  const [clubCode, playDate] = videoCode.split("_");
  const playerArrForCreate = playerArr.map((v) => {
    const { teamName, player } = v;
    return {
      clubCode,
      playDate,
      teamName,
      player,
    };
  });
  await createManyGamePlayer(playerArrForCreate);
});
