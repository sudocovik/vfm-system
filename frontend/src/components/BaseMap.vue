<template>
  <GoogleMap
    :center="center"
    :zoom="zoom"
    :disable-default-ui="areUiControlsDisabled"
    :gesture-handling="gestureHandling"
    :styles="styles"
  />
</template>

<script lang="ts">
/// <reference types="google.maps" />
import { computed, defineComponent, PropType } from 'vue'
import { GoogleMap } from 'vue3-google-map'

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
      type: Object as PropType<google.maps.LatLngLiteral>,
      default: () => DEFAULT_CENTER
    },

    zoom: {
      type: Number,
      default: DEFAULT_ZOOM
    },

    interactive: {
      type: Boolean,
      default: true
    },

    renderPOI: {
      type: Boolean,
      default: true
    }
  },

  setup (props) {
    const areUiControlsDisabled = computed<boolean>(() => !props.interactive)
    const gestureHandling = computed<string>(() => props.interactive ? 'auto' : 'none')

    const styles = [{
      featureType: 'poi',
      elementType: 'labels',
      stylers: [
        { visibility: props.renderPOI ? 'on' : 'off' }
      ]
    }]

    return {
      areUiControlsDisabled,
      gestureHandling,
      styles
    }
  }
})
</script>
