<script setup lang="ts">
type VideoType = {
  name: string;
  size: number;
  duration: number;
  url: string;
};

const videoList = ref<VideoType[]>([]);

const uploader = ref();

const upload = (e: any) => {
  uploader.value.pickFiles(e);
};
const submit = async (files: File[]) => {
  for (const f of files) {
    await new Promise<void>((res) => {
      var video = document.createElement("video");
      video.src = URL.createObjectURL(f);
      video.addEventListener("loadedmetadata", () => {
        videoList.value?.push({
          name: f.name,
          size: formatBytes(f.size),
          duration: formatVideoDuration(video.duration),
          url: URL.createObjectURL(f),
        });
        res();
      });
      video.load();
    });
  }
};
const file = ref();
</script>
<template>
  <div class="col q-pa-md" style="gap: 24px">
    <q-btn
      clickable
      color="pink"
      class="q-mb-md"
      icon-right="upload"
      style="min-height: 8px"
      @click="upload"
    >
      영상 업로드
      <q-file
        ref="uploader"
        v-model="file"
        multiple
        borderless
        dense
        @update:model-value="submit"
        style="display: none"
      />
    </q-btn>

    <q-list bordered padding>
      <q-item-label header>영상 목록</q-item-label>
      <q-item v-for="v in videoList">
        <q-item-section>{{ v.name }}</q-item-section>
        <q-item-section side>
          <q-item-label>{{ v.size }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-item-label>{{ v.duration }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<style lang="scss" scoped></style>
