<script setup lang="ts">
import type { CutType } from "@/types";

const videoStore = useVideoStore();

const video = ref<HTMLVideoElement>();
const canvas = ref<HTMLCanvasElement>();

const file = ref();
const uploader = ref();
const videoOn = ref(false);
const videoPlayOn = ref(false);
const videoName = ref("");

const skipForwardSec = 15;
const forwardSec = 3;
const rewindSec = 3;

const ratioSet = {
  "360p": [640, 360, 6],
  "540p": [960, 540, 4],
  "720p": [1280, 720, 2],
  "1080p": [1920, 1080, 1],
};
const fps = 60;

type RecordFileType = { file: File; duration: number };

const playPlayer = () => {
  if (!video.value) return;
  video.value.play();
  videoPlayOn.value = true;
};

const stopPlayer = () => {
  if (!video.value) return;
  video.value.pause();
  videoPlayOn.value = false;
};

const togglePlayer = () => {
  if (!video.value) return;
  if (video.value.paused || video.value.ended) return playPlayer();
  return stopPlayer();
};

const movePlayer = (time: string) => {
  if (!video.value) return;
  video.value.currentTime = time2sec(time);
};

const uploadVideo = (e: any) => uploader.value.pickFiles(e);

const KeyPressArrow = async (event: any) => {
  if (!video.value) return;
  const currentTime = video.value.currentTime;
  const duration = video.value.duration;

  const updateDirect = async (delay: 1 | -1) => {
    const newTime = currentTime + delay;
    const { error } = await updateCutV2("seekTime", formatTime(newTime));
    if (!video.value) return;
    if (!error) video.value.currentTime = newTime;
  };

  switch (event.key) {
    case "ArrowUp":
    case "ArrowDown":
      break;

    case "ArrowLeft":
      if ((video.value.paused || video.value.ended) && event.ctrlKey) {
        updateDirect(-1);
        return;
      }
      video.value.currentTime = Math.max(currentTime - rewindSec, 0);
      break;

    case "ArrowRight":
      if ((video.value.paused || video.value.ended) && event.ctrlKey) {
        updateDirect(+1);
        return;
      }

      if (video.value.paused || video.value.ended || event.ctrlKey) {
        video.value.currentTime = Math.min(currentTime + skipForwardSec, duration);
        return;
      }

      const highSpeed = 8;
      if (video.value.playbackRate !== highSpeed) {
        videoStore.value.currSpeed = video.value.playbackRate;
        video.value.playbackRate = highSpeed;
        setTimeout(() => {
          if (!video.value) return;
          video.value.playbackRate = videoStore.value.currSpeed;
        }, (1000 / 8) * forwardSec);
        return;
      }

      video.value.playbackRate = videoStore.value.currSpeed;
      break;
    default:
      break;
  }
};

const submitVideo = async (f: File) => {
  videoName.value = f.name;
  if (!video.value) return;
  video.value.src = URL.createObjectURL(f);
  videoOn.value = true;
  video.value.addEventListener("loadedmetadata", () => {
    if (!video.value) return;
    const videoObject = {
      video,
      videoName,
      togglePlayer,
      stopPlayer,
      movePlayer,
      KeyPressArrow,
      createCaptureVideo,
    };
    videoStore.value.videoElems.push(videoObject);
    video.value.playbackRate = videoStore.value.currSpeed;
  });
};

async function createCaptureVideo(cut: CutType): Promise<RecordFileType> {
  const videoElem = video.value;
  const canvasElem = canvas.value;
  if (!videoElem || !canvasElem) throw "video, canvas 없이 못해!";

  const backboardPositionState = useBackboardPositionState(videoName.value);
  const pos = backboardPositionState.value;

  const { seekTime, skill, subPlayer } = cut;

  const seekSec = time2sec(seekTime);
  const segment = getSegment(skill, subPlayer);
  const totalSec = segment.reduce((acc: any, seg: { sec: any }) => acc + seg.sec, 0);
  const startSec = seekSec - totalSec + 2;

  const [width, height] = ratioSet["540p"];
  canvasElem.width = width;
  canvasElem.height = height;
  const canvasContext = canvasElem.getContext("2d");
  if (!canvasContext) throw "canvasContext is null!";

  const originSpeed = videoElem.playbackRate;
  const mimeType = "video/webm; codecs=vp9";
  const opt = { mimeType, videoBitsPerSecond: 5000 * 1000 };
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

    videoStore.value.isMediaRecording = true;

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
</script>
<template>
  <ControlBar
    v-if="video"
    :video="video"
    :video-name="videoName"
    :playOn="videoPlayOn"
    style="z-index: 1"
    @togglePlayPause="togglePlayer()"
  />
  <div class="column videoLayer">
    <EditorDragRecordBox v-if="video" :video="video" :video-name="videoName" />
    <q-btn color="orange-7" text-color="white" style="position: absolute" @click="uploadVideo">
      영상 업로드
      <q-file ref="uploader" v-model="file" :multiple="false" @update:model-value="submitVideo" style="display: none" />
    </q-btn>
    <video v-show="videoOn" ref="video" width="960" height="540" tabindex="-1" style="position: fixed" />
    <canvas ref="canvas" style="width: 960px; height: 540px" />
  </div>
</template>

<style lang="scss" scoped>
:focus-visible {
  outline: 0;
}
.videoLayer {
  border-left: 1px solid $orange-7;
  border-right: 1px solid $orange-7;
  height: 540px;
  position: relative;
  background: #777;
  align-items: center;
  justify-content: center;
}
</style>
