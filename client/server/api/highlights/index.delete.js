import { deleteByVideo } from "../../data/highlights";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { videoName, seekTime } = body;
  await deleteByVideo(videoName, seekTime);
});
