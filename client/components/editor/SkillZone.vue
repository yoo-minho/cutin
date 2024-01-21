<script setup lang="ts">
import { defaultSkill } from "@/composables/constants";

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
    await updateCutV2(type, value);
  }
  (document.activeElement as HTMLBodyElement).blur();
};
</script>

<template>
  <div class="bg-dark row" style="overflow-y: auto; height: 100%">
    <q-btn clickable color="yellow" text-color="black" class="q-ma-md">
      스<br />
      킬<br />
      🏀
    </q-btn>
    <div class="row col q-my-md" style="gap: 12px">
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
          <div style="letter-spacing: -0.5px">
            <q-icon name="keyboard" class="q-px-xs" size="xs" />S +
            {{ skill.key }}
          </div>
          <div style="font-size: 11px; color: yellow; letter-spacing: -0.5px">
            {{ skill.name || "-" }}
          </div>
        </div>
      </q-btn>
    </div>
  </div>
</template>
