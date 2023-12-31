import { deleteGamePlayer } from "~/server/data/gamePlayer";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { videoCode, teamName, player } = body;
  const [clubCode, playDate] = videoCode.split("_");
  await deleteGamePlayer(clubCode, playDate, teamName, player);
});
