<script setup lang="ts">
import { defaultSkill } from "@/composables/constants";

const videoProps = useVideoPropsStore();

const _updateCut = async (
  type: "mainPlayer" | "subPlayer" | "skill" | "videoUrl" | "seekTime",
  value?: string
) => {
  if (!value) {
    Notify.create({
      type: "negative",
      message: "스킬이 지정되어 있지 않습니다.",
    });
  } else {
    await updateCut(type, value);
  }
  videoProps.value.videoEl?.focus();
};
</script>

<template>
  <div class="bg-dark" style="height: 100%">
    <q-btn
      clickable
      color="yellow"
      text-color="black"
      class="q-ma-md"
      style="min-height: 8px"
    >
      스킬 🏀
    </q-btn>
    <div class="row justify-center" style="gap: 12px">
      <q-btn
        v-for="skill in defaultSkill"
        clickable
        text-color="white"
        color="black"
        class="col-1"
        padding="0px 4px"
        @click="_updateCut('skill', skill.name)"
      >
        <div>
          <div style="font-weight: 600; color: yellow">S + {{ skill.key }}</div>
          <div style="font-size: 11px">{{ skill.name || "-" }}</div>
        </div>
      </q-btn>
    </div>
  </div>
</template>
