export function getUrl2(url: any, size: number, time: number) {
  const pastSec = 8;
  const speed = 1.6;

  return new Promise<void>(async (res) => {
    const videoElement = document.createElement("video") as any;
    videoElement.src = url;
    videoElement.playbackRate = speed;
    // videoElement.muted = true;

    await new Promise((res) =>
      videoElement.addEventListener("loadedmetadata", res)
    );

    const originBitrate = (size / videoElement.duration) * 8;
    console.log({ originBitrate });

    const mediaRecorderOptions = {
      videoBitsPerSecond: originBitrate, // 비트레이트 설정 (고화질에 맞게 조절)
    };
    const mediaRecorder = new MediaRecorder(
      videoElement.captureStream(),
      mediaRecorderOptions
    );
    const chunks = [] as any[];
    mediaRecorder.ondataavailable = function (event) {
      if (event.data.size > 0) chunks.push(event.data);
    };
    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunks, { type: "video/mp4" });
      const blobUrl = URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");
      downloadLink.href = blobUrl;
      downloadLink.download = "temp.mp4";
      downloadLink.click();
      res();
    };

    videoElement.currentTime = time - pastSec / speed + 1;
    videoElement.play();
    mediaRecorder.start();

    setTimeout(() => {
      mediaRecorder.stop();
      videoElement.pause();
    }, (pastSec / speed) * 1000);
  });
}

export function getUrl3(url: any, size: number, time: number) {
  const pastSec = 9;
  const speed = 0.5;
  const fps = 24;
  const [width, height, bitrateRatio] = [960, 540, 6];
  //   const [width, height, bitrateRatio] = [1280, 720, 4];

  return new Promise<void>(async (res) => {
    const canvasElement = document.createElement("canvas");
    canvasElement.width = width;
    canvasElement.height = height;
    const canvasContext = canvasElement.getContext("2d");

    const videoElement = document.createElement("video") as any;
    videoElement.src = url;
    videoElement.playbackRate = speed;
    videoElement.muted = true;

    await new Promise((res) =>
      videoElement.addEventListener("loadedmetadata", res)
    );

    videoElement.addEventListener("play", () => {
      const renderFrame = () => {
        if (!videoElement.paused && !videoElement.ended) {
          setTimeout(() => {
            canvasContext?.drawImage(videoElement, 0, 0, width, height);
            requestAnimationFrame(renderFrame);
          }, 1000 / fps);
        }
      };
      renderFrame();
    });

    const originBitrate = (size / videoElement.duration) * 8;

    const mediaRecorderOptions = {
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
      const blob = new Blob(chunks, { type: "video/mp4" });
      const blobUrl = URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");
      downloadLink.href = blobUrl;
      downloadLink.download = "temp.mp4";
      downloadLink.click();
      res();
    };

    videoElement.currentTime = time - pastSec + 1 / speed;
    videoElement.play();
    mediaRecorder.start();

    setTimeout(() => {
      mediaRecorder.stop();
      videoElement.pause();
    }, (pastSec / speed) * 1000);
  });
}
