<script setup lang="ts">
const currentYoutube = ref();

const play = () => {
  currentYoutube.value?.contentWindow.postMessage(
    '{"event":"command","func":"playVideo","args":""}',
    "*"
  );
};

const pause = () => {
  currentYoutube.value?.contentWindow.postMessage(
    '{"event":"command","func":"pauseVideo","args":""}',
    "*"
  );
};

const stop = () => {
  console.log("stop", currentYoutube.value?.contentWindow);
  currentYoutube.value?.contentWindow.postMessage(
    '{"event":"command","func":"stopVideo","args":[5, true]}',
    "*"
  );
};

function seekTo(seconds: number) {
  var data = {
    event: "command",
    func: "seekTo",
    args: [seconds, true],
  };
  var message = JSON.stringify(data);
  currentYoutube.value?.contentWindow.postMessage(message, "*");
}

function setPlaybackRate(seconds: number) {
  var data = {
    event: "command",
    func: "setPlaybackRate",
    args: [seconds],
  };
  var message = JSON.stringify(data);
  currentYoutube.value?.contentWindow.postMessage(message, "*");
}

function videoLoad() {
  setTimeout(() => {
    setPlaybackRate(1.5);
    play();
  }, 5000);
}
</script>
<template>
  <div>
    <iframe
      ref="currentYoutube"
      width="560"
      height="315"
      src="https://www.youtube.com/embed/eIhchB33yTE?si=ex3CnXMaVuQvaAf_&autoplay=1&controls=1&enablejsapi=1"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
      @onload="videoLoad()"
    ></iframe>
    <div class="btn_container">
      <div class="btn btn-primary play" @click="play">재생</div>
      <div class="btn btn-warning pause" @click="setPlaybackRate(1.5)">
        일시정지
      </div>
      <div class="btn btn-danger stop" @click="seekTo(5)">정지</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.video {
  margin: 50px auto;
  width: 560px;
}
iframe {
  margin: auto;
}
.btn_container {
  text-align: center;
}
</style>
