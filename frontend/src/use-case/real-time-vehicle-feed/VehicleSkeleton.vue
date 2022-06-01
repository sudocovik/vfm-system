<template>
  <q-card>
    <q-skeleton
      type="rect"
      :height="MAP_HEIGHT + 'px'"
    />

    <q-card-section>
      <q-skeleton
        type="rect"
        height="25px"
        width="30px"
        class="on-left inline-block"
      />
      <q-skeleton
        type="rect"
        width="100px"
        height="20px"
        class="inline-block"
        style="vertical-align: 3px"
      />
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-skeleton
        type="text"
        width="210px"
      />
      <q-skeleton
        type="text"
        width="40px"
      />
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
export default {
  name: 'VehicleSkeleton'
}
</script>

<script lang="ts" setup>
import { MAP_HEIGHT } from './GeoLocatedVehicle.vue'
</script>
