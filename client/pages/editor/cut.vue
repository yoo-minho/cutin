<script setup lang="ts">
const file = ref();
const uploader = ref();
const uploadVideo = (e: any) => uploader.value.pickFiles(e);
const submitVideo = async (file: File) => {
  console.log("xxxx");
  const body = new FormData();
  body.append("file", file);
  const { data } = await useFetch("/api/simple", { method: "POST", body });
};
</script>
<template>
  <div>
    <q-btn
      color="orange-7"
      text-color="white"
      icon-right="file_download"
      style="position: absolute"
      @click="uploadVideo"
    >
      영상 업로드
      <q-file
        ref="uploader"
        v-model="file"
        :multiple="false"
        borderless
        dense
        @update:model-value="submitVideo"
        style="display: none"
      />
    </q-btn>
  </div>
</template>

<style lang="scss" scoped></style>
