import { getHighlightByVideo } from "../../data/highlights";

export default defineEventHandler(async (event) => {
  const { videoName } = getQuery(event);
  return await getHighlightByVideo(videoName);
});
