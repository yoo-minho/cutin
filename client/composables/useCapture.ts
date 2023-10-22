import { CutType } from "@/types";

/*
4K 3840x2160
1080p 1920x1080
720p 1280x720 
480p 854x480
360p 640x360
240p 426x240
*/
const ratioSet = {
  "360p": [640, 360, 6],
  "540p": [960, 540, 6],
  "720p": [1280, 720, 4],
  "1080p": [1920, 1080, 1],
};

const segmentSet = {
  deep: [
    { sec: 4, speed: 2 }, //2
    { sec: 0.5, speed: 2, zoom: 1.3 }, //0.25
    { sec: 3, speed: 0.8, zoom: 1.3 }, //3.75
    { sec: 1, speed: 2 }, //0.5
  ],
  wide: [
    { sec: 6, speed: 1.5 },
    { sec: 3, speed: 2, zoom: 1.3 },
  ],
  short: [{ sec: 4, speed: 1.5, zoom: 1.5 }],
};

export function getUrl3(url: string, size: number, cut: CutType) {
  const { seekTime, skill = "" } = cut;
  const time = time2sec(seekTime);
  let segment: any[];
  if (
    ["오펜스리바", "리바운드", "자유투", "스틸", "스핀무브"].includes(skill)
  ) {
    segment = segmentSet.short;
  } else if (["득점&어시", ""].includes(skill)) {
    segment = segmentSet.deep;
  } else if (["3점슛"].includes(skill)) {
    segment = segmentSet.wide;
  } else {
    segment = segmentSet.wide;
  }
  const totalSec = segment.reduce((acc, seg) => acc + seg.sec, 0);
  const [width, height, bitrateRatio] = ratioSet["720p"];

  let currenrZoom = 1;
  let zoomTime = 0;

  return new Promise<any>(async (res) => {
    const canvasElement = document.createElement("canvas");
    canvasElement.width = width;
    canvasElement.height = height;
    const canvasContext = canvasElement.getContext("2d");

    const videoElement = document.createElement("video") as any;
    videoElement.src = url;
    videoElement.muted = true;

    await new Promise((res) =>
      videoElement.addEventListener("loadedmetadata", res)
    );

    videoElement.addEventListener("play", () => {
      let _zoom = 1;
      const renderFrame = () => {
        if (!videoElement.paused && !videoElement.ended) {
          _zoom += (currenrZoom - 1) / (60 * zoomTime);
          if (_zoom > 1) {
            canvasContext?.setTransform(1, 0, 0, 1, 0, 0);
            const ratio = (_zoom - 1) / (_zoom * 2);
            canvasContext?.scale(_zoom, _zoom);
            canvasContext?.translate(-(width * ratio), -(height * ratio * 0.5));
          } else {
            _zoom = 1;
          }
          canvasContext?.drawImage(videoElement, 0, 0, width, height);
          requestAnimationFrame(renderFrame);
        }
      };
      renderFrame();
    });

    const originBitrate = (size / videoElement.duration) * 8;

    const mediaRecorderOptions = {
      mimeType: "video/webm",
      videoBitsPerSecond: originBitrate / bitrateRatio,
    };
    const mediaRecorder = new MediaRecorder(
      canvasElement.captureStream(),
      mediaRecorderOptions
    );
    const chunks = [] as any[];
    mediaRecorder.ondataavailable = function (event) {
      if (event.data.size > 0) chunks.push(event.data);
    };
    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      res({ file: new File([blob], "temp.webm") });
    };

    const start = time - totalSec + 2;
    videoElement.currentTime = start;

    videoElement.play();
    mediaRecorder.start();

    for (const seg of segment) {
      const segSpeed = seg.speed * 2.5;
      videoElement.playbackRate = segSpeed;
      currenrZoom = seg.zoom || 1;
      zoomTime = currenrZoom > 1 ? seg.sec / segSpeed : 0;
      await delay(seg.sec / segSpeed);
    }

    mediaRecorder.stop();
    videoElement.pause();
  });
}
