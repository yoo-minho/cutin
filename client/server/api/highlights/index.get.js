import {
  getHighlightByVideo,
  getHighlightByVideoByGameNo,
} from "../../data/highlights";

export default defineEventHandler(async (event) => {
  const { videoName, multiVideo } = getQuery(event);
  const [clubCode, playDate, gameNo] = videoName.split(".")[0].split("_");
  if (multiVideo) {
    return await getHighlightByVideoByGameNo(clubCode, playDate, gameNo);
  }
  return await getHighlightByVideo(videoName);
});
