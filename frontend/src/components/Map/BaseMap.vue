<template>
  <GoogleMap
    :center="center"
    :zoom="zoom"
    :disable-default-ui="areUiControlsDisabled"
    :gesture-handling="gestureHandling"
    :styles="styles"
    :api-key="apiKey"
    :class="$attrs.class"
    :style="$attrs.style"
  >
    <slot />
  </GoogleMap>
</template>

<script lang="ts">
/// <reference types="google.maps" />
import { computed, defineComponent, PropType } from 'vue'
import { GoogleMap } from 'vue3-google-map'
import { GoogleMapOptions } from 'src/config/GoogleMapOptions'

const croatia = {
  coordinates: {
    lat: 44.698832,
    lng: 16.373162
  },
  zoom: 7
}

export const DEFAULT_CENTER = croatia.coordinates
export const DEFAULT_ZOOM = croatia.zoom

export const GESTURE_HANDLING = {
  ENABLED: 'auto',
  DISABLED: 'none'
}

export const POI_VISIBILITY = {
  VISIBLE: 'on',
  INVISIBLE: 'off'
}

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
    const gestureHandling = computed<string>(() => props.interactive ? GESTURE_HANDLING.ENABLED : GESTURE_HANDLING.DISABLED)

    const styles = computed<google.maps.MapTypeStyle[]>(() => [{
      featureType: 'poi',
      elementType: 'labels',
      stylers: [
        { visibility: props.renderPOI ? POI_VISIBILITY.VISIBLE : POI_VISIBILITY.INVISIBLE }
      ]
    }, {
      featureType: 'transit',
      elementType: 'all',
      stylers: [
        { visibility: props.renderPOI ? POI_VISIBILITY.VISIBLE : POI_VISIBILITY.INVISIBLE }
      ]
    }])

    const apiKey = GoogleMapOptions.apiKey()

    return {
      areUiControlsDisabled,
      gestureHandling,
      styles,
      apiKey
    }
  }
})
</script>
