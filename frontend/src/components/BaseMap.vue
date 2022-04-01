<template>
  <GoogleMap
    :center="center"
    :zoom="zoom"
    :disable-default-ui="areUiControlsDisabled"
    :gesture-handling="gestureHandling"
  />
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
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
    },

    interactive: {
      type: Boolean,
      default: true
    }
  },

  setup (props) {
    const areUiControlsDisabled = computed<boolean>(() => !props.interactive)
    const gestureHandling = computed<string>(() => props.interactive ? 'auto' : 'none')

    return {
      areUiControlsDisabled,
      gestureHandling
    }
  }
})
</script>
