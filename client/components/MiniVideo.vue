<script setup lang="ts">
const props = defineProps<{ src: string }>();
</script>
<template>
  <q-card style="max-width: fit-content">
    <video :src="src" width="960" height="540" autoplay loop />
    <!-- <q-card-section>
      <q-btn
        fab
        color="primary"
        icon="play_arrow"
        class="absolute"
        style="top: 0; right: 12px; transform: translateY(-50%)"
      />
      <div class="row no-wrap items-center">
        <div class="col text-h6 ellipsis">Cafe Basilico</div>
        <div
          class="col-auto text-grey text-caption q-pt-md row no-wrap items-center"
        >
          <q-icon name="place" />
          250 ft
        </div>
      </div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <div class="text-subtitle1">$・Italian, Cafe</div>
      <div class="text-caption text-grey">
        Small plates, salads & sandwiches in an intimate setting.
      </div>
    </q-card-section>

    <q-separator />

    <q-card-actions align="right">
      <q-btn v-close-popup flat color="primary" label="Reserve" />
    </q-card-actions> -->
  </q-card>
</template>

<style lang="scss" scoped></style>
