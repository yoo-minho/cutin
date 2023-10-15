/*
4K 3840x2160
1080p 1920x1080
720p 1280x720 
480p 854x480
360p 640x360
240p 426x240
*/

export function getUrl3(
  url: string,
  size: number,
  seekTime: string,
  path: string
) {
  const time = time2sec(seekTime);
  //   const segmentSet = [{ sec: 9, speed: 1.5 }];
  const segmentSet = [
    { sec: 3.5, speed: 2 }, //1.5
    { sec: 0.5, speed: 2, zoom: 1.3 }, //0.5
    { sec: 3, speed: 0.8, zoom: 1.3 }, //3.75
    { sec: 1, speed: 2 }, //0.5
  ];
  const totalSec = segmentSet.reduce((acc, seg) => acc + seg.sec, 0);
  const fps = 30;
  // const [width, height, bitrateRatio] = [960, 540, 6];
  const [width, height, bitrateRatio] = [1280, 720, 4];
  // const [width, height, bitrateRatio] = [1920, 1080, 1];

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
          setTimeout(() => {
            _zoom += (currenrZoom - 1) / (fps * zoomTime);
            if (_zoom > 1) {
              canvasContext?.setTransform(1, 0, 0, 1, 0, 0);
              const ratio = (_zoom - 1) / (_zoom * 2);
              canvasContext?.scale(_zoom, _zoom);
              canvasContext?.translate(-(width * ratio), -(height * ratio));
            } else {
              _zoom = 1;
            }
            canvasContext?.drawImage(videoElement, 0, 0, width, height);
            requestAnimationFrame(renderFrame);
          }, 1000 / fps);
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
      canvasElement.captureStream(fps),
      mediaRecorderOptions
    );
    const chunks = [] as any[];
    mediaRecorder.ondataavailable = function (event) {
      if (event.data.size > 0) chunks.push(event.data);
    };
    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunks, { type: "video/webm" });

      const formData = new FormData();
      formData.append("file", new File([blob], "temp.webm"));
      formData.append("path", path);

      const { data } = await useFetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      // const blobUrl = URL.createObjectURL(blob);
      // const downloadLink = document.createElement("a");
      // downloadLink.href = blobUrl;
      // downloadLink.download = "temp.webm";
      // downloadLink.click();

      res(data.value);
    };

    videoElement.currentTime = time - totalSec + 1.5;
    videoElement.play();
    mediaRecorder.start();

    for (const seg of segmentSet) {
      videoElement.playbackRate = seg.speed;
      currenrZoom = seg.zoom || 1;
      zoomTime = currenrZoom > 1 ? seg.sec / seg.speed : 0;
      await delay(seg.sec / seg.speed);
    }

    mediaRecorder.stop();
    videoElement.pause();
  });
}
