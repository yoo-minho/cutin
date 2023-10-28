import {
  getHighlightByVideo,
  getHighlightByVideoByGameNo,
} from "../../data/highlights";

export default defineEventHandler(async (event) => {
  const { videoName, multiVideo } = getQuery(event);
  const [clubCode, playDate, gameNo] = videoName.split("_");
  console.log({ multiVideo });
  if (multiVideo) {
    return await getHighlightByVideoByGameNo(clubCode, playDate, gameNo);
  }
  return await getHighlightByVideo(videoName);
});
