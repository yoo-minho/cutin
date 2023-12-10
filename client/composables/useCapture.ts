const ratioSet = {
  "360p": [640, 360, 6],
  "540p": [960, 540, 4],
  "720p": [1280, 720, 2],
  "1080p": [1920, 1080, 1],
};

const fps = 60;

let chunks = [] as any;
let _zoom = 1;
let zoomTick = 0;
type PostionType = { top: number; left: number; width: number; height: number };

export async function createCaptureVideo(
  size: number,
  seekSec: number,
  segment: any,
  pos: PostionType
) {
  chunks = [];
  _zoom = 1;

  const totalSec = segment.reduce(
    (acc: any, seg: { sec: any }) => acc + seg.sec,
    0
  );
  const startSec = seekSec - totalSec + 2;

  const videoElem = document.getElementById("baseVideo") as HTMLVideoElement;
  const originBitrate = (size / videoElem.duration) * 8;
  const [width, height, bitrateRatio] = ratioSet["540p"];
  const videoBitsPerSecond = originBitrate / bitrateRatio;
  const canvasElem = document.getElementById("baseCanvas") as HTMLCanvasElement;
  canvasElem.width = width;
  canvasElem.height = height;
  const canvasContext = canvasElem.getContext("2d");
  if (!canvasContext) return { file: null };

  const originSpeed = videoElem.playbackRate;
  const mimeType = "video/webm; codecs=vp9";
  const opt = { mimeType, videoBitsPerSecond };

  const playListener = () => {
    const renderFrame = () => {
      if (videoElem.paused || videoElem.ended) return;

      _zoom += zoomTick;
      if (_zoom <= 1) _zoom = 1;
      const baseZoom = pos.width > 0 ? 960 / pos.width : 1;
      const left2 = (_zoom - 1) * pos.width;
      const top2 = ((_zoom - 1) * pos.height) / 2;
      canvasContext.clearRect(0, 0, width, height);
      canvasContext.translate(
        (-pos.left - left2) * (width / pos.width) || 0,
        (-pos.top - top2) * (height / pos.height) || 0
      );
      canvasContext.scale(baseZoom * _zoom, baseZoom * _zoom);
      canvasContext.drawImage(videoElem, 0, 0, width, height);
      requestAnimationFrame(renderFrame);
    };
    renderFrame();
  };
  videoElem.addEventListener("play", playListener);

  return new Promise<{ file: File }>(async (res) => {
    const mediaRecorder = new MediaRecorder(canvasElem.captureStream(fps), opt);
    mediaRecorder.ondataavailable = ({ data }) => {
      if (data.size > 0) chunks.push(data);
    };
    mediaRecorder.onstop = () => {
      videoElem.removeEventListener("play", playListener);
      videoElem.pause();
      videoElem.muted = false;
      videoElem.currentTime = seekSec;
      videoElem.playbackRate = originSpeed;

      const file = new File(
        [new Blob(chunks, { type: "video/webm" })],
        "temp.webm"
      );
      chunks = [];
      return res({ file });
    };
    videoElem.currentTime = startSec;
    videoElem.muted = true;
    await videoElem.play();
    mediaRecorder.start();
    for (const seg of segment) {
      const { sec, speed, zoom = 1 } = seg;
      const segSpeed = speed * 2.5;
      videoElem.playbackRate = segSpeed;
      zoomTick = zoom === 1 ? 0 : (zoom - 1) / (fps * (sec / segSpeed));
      await delay(sec / segSpeed);
    }
    mediaRecorder.stop();
  });
}
