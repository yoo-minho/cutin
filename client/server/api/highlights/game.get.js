import { getHighlightByVideoByGameNo } from "../../data/highlights";

export default defineEventHandler(async (event) => {
  const { clubCode, playDate, gameNo, player } = getQuery(event);

  return await getHighlightByVideoByGameNo(clubCode, playDate, gameNo);
});
