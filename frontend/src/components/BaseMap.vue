<template>
  <GoogleMap
    :center="center"
    :zoom="zoom"
  />
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { GoogleMap } from 'vue3-google-map'

export type Position = {
  lat: number
  lng: number
}

const croatia = {
  coordinates: {
    lat: 44.698832,
    lng: 16.373162
  },
  zoom: 7
}

export const DEFAULT_CENTER = croatia.coordinates
export const DEFAULT_ZOOM = croatia.zoom

export default defineComponent({
  name: 'BaseMap',

  components: {
    GoogleMap
  },

  inheritAttrs: false,

  props: {
    center: {
      type: Object as PropType<Position>,
      default: () => DEFAULT_CENTER
    },

    zoom: {
      type: Number,
      default: DEFAULT_ZOOM
    }
  }
})
</script>
