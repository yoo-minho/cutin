import { deleteGamePlayer } from "~/server/data/gamePlayer";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { videoCode, player } = body;
  const [clubCode, playDate] = videoCode.split("_");
  await deleteGamePlayer(clubCode, playDate, player);
});
