import { CutType } from "@/types";

const ratioSet = {
  "360p": [640, 360, 6],
  "540p": [960, 540, 6],
  "720p": [1280, 720, 2],
  "1080p": [1920, 1080, 1],
};

const fps = 60;

const segmentSet = {
  //8초 => 6초
  deep: [
    { sec: 2.5, speed: 1.5 },
    { sec: 0.5, speed: 1.5, zoom: 1.3 }, //2
    { sec: 3, speed: 1, zoom: 1.3 }, //3
    { sec: 2, speed: 2 }, //1
  ],
  //8초 => 5초
  wide: [
    { sec: 4, speed: 1.6 }, //2.5
    { sec: 1, speed: 1 }, //1
    { sec: 3, speed: 2, zoom: 1.3 }, //1.5
  ],
  //5초 => 3초
  short: [
    { sec: 2, speed: 2 }, //1
    { sec: 1.5, speed: 1.2, zoom: 1.3 }, //1.25
    { sec: 1.5, speed: 2, zoom: 1.3 }, //0.75
  ],
};

const getSegment = (_skill: string) => {
  if (["오펜스리바", "리바운드", "스틸", "자유투", "속공"].includes(_skill))
    return segmentSet.short;
  if (["득점&어시", "풋백", "스핀무브", "앤드원"].includes(_skill))
    return segmentSet.deep;
  if (["3점슛"].includes(_skill)) return segmentSet.wide;
  return segmentSet.wide;
};

let chunks = [] as any;
let _zoom = 1;
let zoomTick = 0;

export async function createCaptureVideo(size: number, cut: CutType) {
  chunks = [];
  _zoom = 1;

  const { seekTime, skill, mainPlayer, subPlayer, vsScore } = cut;
  console.log({ cut });
  const _skill = skill || "득점&어시";
  const time = time2sec(seekTime);
  const segment = getSegment(_skill);
  const totalSec = segment.reduce((acc, seg) => acc + seg.sec, 0);
  const videoElem = document.getElementById("baseVideo") as HTMLVideoElement;
  const originBitrate = (size / videoElem.duration) * 8;
  const [width, height, bitrateRatio] = ratioSet["720p"];
  const videoBitsPerSecond = originBitrate / bitrateRatio;
  const canvasElem = document.getElementById("baseCanvas") as HTMLCanvasElement;
  canvasElem.width = width;
  canvasElem.height = height;
  const canvasContext = canvasElem.getContext("2d");
  if (!canvasContext) return { file: null };

  const start = time - totalSec + 2;
  const originSpeed = videoElem.playbackRate;
  const mimeType = "video/webm; codecs=vp9";
  const opt = { mimeType, videoBitsPerSecond };
  let x = 0;
  const fontSize = 48;
  canvasContext.font = `${fontSize}px Giants-Bold`; // 원하는 폰트 및 크기로 설정

  const prefix = ["리바운드", "스틸", "오펜스리바"].includes(_skill)
    ? ""
    : "🏀";

  const playListener = () => {
    const renderFrame = () => {
      if (videoElem.paused || videoElem.ended) return;

      _zoom += zoomTick;
      const ratio = (_zoom - 1) / (_zoom * 2);
      if (ratio > 0) {
        canvasContext.setTransform(1, 0, 0, 1, 0, 0);
        canvasContext.scale(_zoom, _zoom);
        canvasContext.translate(-(width * ratio), -(height * ratio * 0.5));
      } else {
        _zoom = 1;
      }
      canvasContext.drawImage(videoElem, 0, 0, width, height);

      const zoomX = 48 / _zoom + width * ratio;
      const zoomY = (height - 48) / _zoom + height * ratio * 0.5;
      const zoomFontSize = fontSize / _zoom;
      const borderSize = zoomFontSize * 0.3;

      const text = [
        " " + mainPlayer,
        prefix + _skill,
        subPlayer ? `ast.${subPlayer}` : "",
        `[${JSON.stringify(vsScore)}]`,
      ]
        .filter((v) => !!v)
        .join(" - ");
      canvasContext.font = `${zoomFontSize}px Giants-Bold`;
      const textWidth = canvasContext.measureText(text).width;

      canvasContext.fillStyle = "white";
      roundRect(
        canvasContext,
        zoomX,
        zoomY - zoomFontSize,
        textWidth + borderSize,
        zoomFontSize + borderSize,
        borderSize
      );

      canvasContext.fillStyle = "black";
      canvasContext.fillText(text, zoomX, zoomY);
      requestAnimationFrame(renderFrame);
    };
    x = 0;
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
      videoElem.currentTime = time;
      videoElem.playbackRate = originSpeed;

      const file = new File(
        [new Blob(chunks, { type: "video/webm" })],
        "temp.webm"
      );
      chunks = [];
      return res({ file });
    };
    videoElem.currentTime = start;
    videoElem.muted = true;
    await videoElem.play();
    mediaRecorder.start();
    for (const seg of segment) {
      const { sec, speed, zoom = 1 } = seg;
      const segSpeed = speed * 1.5;
      videoElem.playbackRate = segSpeed;
      zoomTick = zoom === 1 ? 0 : (zoom - 1) / (fps * (sec / segSpeed));
      await delay(sec / segSpeed);
    }
    mediaRecorder.stop();
  });
}
