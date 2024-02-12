import type { CutType } from "@/types";

const ratioSet = {
  "360p": [640, 360, 6],
  "540p": [960, 540, 4],
  "720p": [1280, 720, 2],
  "1080p": [1920, 1080, 1],
};
const fps = 60;

type RecordFileType = { file: File; duration: number };

export async function createCaptureVideo(cut: CutType): Promise<RecordFileType> {
  const backboardPositionState = useBackboardPositionState();
  const pos = backboardPositionState.value;

  const { seekTime, skill, subPlayer } = cut;

  const seekSec = time2sec(seekTime);
  const segment = getSegment(skill, subPlayer);
  const totalSec = segment.reduce((acc: any, seg: { sec: any }) => acc + seg.sec, 0);
  const startSec = seekSec - totalSec + 2;

  const videoElem = document.getElementById("baseVideo") as HTMLVideoElement;
  const canvasElem = document.getElementById("baseCanvas") as HTMLCanvasElement;

  const [width, height] = ratioSet["540p"];
  canvasElem.width = width;
  canvasElem.height = height;
  const canvasContext = canvasElem.getContext("2d");
  if (!canvasContext) throw "canvasContext is null!";

  const originSpeed = videoElem.playbackRate;
  const mimeType = "video/webm; codecs=vp9";
  const opt = { mimeType, videoBitsPerSecond: 500 * 1000 };
  const mediaRecorder = new MediaRecorder(canvasElem.captureStream(fps), opt);
  const chunks = [] as any;

  const playListener = () => {
    const renderFrame = () => {
      if (videoElem.paused || videoElem.ended) return;

      const { width: posW, height: posH, left: posL, top: posT } = pos;
      const zoom = posW > 0 ? 960 / posW : 1;
      canvasContext.clearRect(0, 0, width, height);
      canvasContext.setTransform(zoom, 0, 0, zoom, -posL * (width / posW), -posT * (height / posH));
      canvasContext.drawImage(videoElem, 0, 0, width, height);
      requestAnimationFrame(renderFrame);
    };
    renderFrame();
  };
  videoElem.addEventListener("play", playListener);

  return new Promise(async (res) => {
    const recordSpeed = 2.5;
    const type = "video/webm";

    let accPlaySec = 0;
    const start = performance.now();

    mediaRecorder.ondataavailable = ({ data }) => {
      if (data.size > 0) chunks.push(data);
    };
    mediaRecorder.onstop = () => {
      videoElem.removeEventListener("play", playListener);
      videoElem.pause();
      videoElem.muted = false;
      videoElem.currentTime = seekSec;
      videoElem.playbackRate = originSpeed;

      const file = new File([new Blob(chunks, { type })], "temp.webm", { type });
      if (file === null) throw "의미 있나?";
      if (file.size < 10 * 1024) throw "10KB 이하일수는 없지!";
      if (accPlaySec * 1000 > performance.now() - start) throw "설정한 시간보다 짧을 수는 없지!";
      return res({ file, duration: Math.round(accPlaySec * 1000 * recordSpeed) });
    };

    videoElem.currentTime = startSec;
    videoElem.muted = true;
    await videoElem.play();

    mediaRecorder.start();
    for (const seg of segment) {
      const { sec, speed } = seg;
      const segSpeed = speed * recordSpeed;
      videoElem.playbackRate = segSpeed;
      const playSec = sec / segSpeed;
      accPlaySec += playSec;
      await delay(playSec);
    }
    mediaRecorder.stop();
  });
}
