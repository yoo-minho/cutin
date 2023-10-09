<script setup lang="ts">
type VideoType = {
  name: string;
  size: number;
  duration: string;
  url: string;
};

const videoList = ref<VideoType[]>([]);
const file = ref();
const uploader = ref();
const videoProps = useVideoPropsStore();

const upload = (e: any) => {
  uploader.value.pickFiles(e);
};
const submit = async (files: File[]) => {
  for (const f of files) {
    await new Promise<void>((res) => {
      const video = document.createElement("video");
      video.src = URL.createObjectURL(f);
      video.addEventListener("loadedmetadata", () => {
        videoList.value?.push({
          name: f.name,
          size: f.size,
          duration: formatVideoDuration(video.duration),
          url: URL.createObjectURL(f),
        });
        res();
      });
      video.load();
    });
  }
  const firstFile = videoList.value[0];
  selectFile(firstFile.name, firstFile.url, firstFile.size);
};

const selectFile = async (videoName: string, url: string, size: number) => {
  const [name, date] = videoName.split("_");

  videoProps.value.videoCode = name + "_" + date;
  videoProps.value.videoName = videoName;
  videoProps.value.videoUrl = url;
  videoProps.value.videoSize = size;

  // const cutStore = useCutStore(videoName);
  // await useFetch("/api/highlights/sync", {
  //   method: "post",
  //   body: { videoName, seekArr: cutStore.value },
  // });
};

const columns = [
  {
    label: "name",
    name: "name",
    field: "name",
    align: "center",
    style: { width: "72px" },
  },
  {
    label: "time",
    name: "time",
    field: "time",
    align: "center",
    style: { width: "30%" },
  },
  {
    label: "size",
    name: "size",
    field: "size",
    align: "center",
    style: { width: "30%" },
  },
] as any;
</script>
<template>
  <div class="bg-dark" style="height: 100%; border-right: 0.5px solid grey">
    <q-btn
      clickable
      color="pink"
      class="q-ma-md"
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
    <q-separator color="grey-7" size="0.5px" />
    <q-table
      dark
      flat
      dense
      :columns="columns"
      :rows="videoList"
      :rows-per-page-options="[0]"
      :hide-pagination="true"
    >
      <template #no-data>
        <div class="full-width column text-pink q-my-sm">
          <span>'{팀이름(영어)}_{날짜8자리}_순서' 이름으로</span>
          <span> 영상이름을 변경후 업로드해주세요! </span>
          <span> ex) gba_20231006_1, gba_20231006_2</span>
        </div>
      </template>

      <template #body="props">
        <q-tr
          :props="props"
          :class="props.row.url === videoProps.videoUrl ? 'text-pink' : ''"
        >
          <q-td key="name" :props="props">
            <div
              class="text-pre-wrap cursor-pointer"
              @click="
                selectFile(
                  String(props.row.name),
                  String(props.row.url),
                  +props.row.size
                )
              "
            >
              {{ props.row.name }}
            </div>
          </q-td>
          <q-td key="time" :props="props">{{ props.row.duration }} </q-td>
          <q-td key="size" :props="props">
            {{ formatBytes(props.row.size) }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <q-separator color="grey-7" size="1px" />
  </div>
</template>
<style lang="scss" scoped></style>
