<template>
  <GoogleMapMarker
    :options="markerOptions"
  />
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { Marker as GoogleMapMarker } from 'vue3-google-map'
import type { MapIcon } from './Icon'

export default defineComponent({
  name: 'MapMarker',

  components: {
    GoogleMapMarker
  },

  inheritAttrs: false,

  props: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    },
    icon: {
      type: Object as PropType<MapIcon>,
      default: undefined
    },
    iconCenter: {
      type: Boolean,
      default: false
    }
  },

  setup (props) {
    const wantsMarkerIcon = computed<boolean>(() => props.icon !== undefined)

    const markerIcon = computed(() => {
      if (!wantsMarkerIcon.value) return {}
      const icon = props.icon as MapIcon

      const anchorCenter = () => ({
        anchor: {
          x: icon.width() / 2,
          y: icon.height() / 2
        }
      })

      return {
        url: icon.toUrl(),
        ...(props.iconCenter ? anchorCenter() : {})
      }
    })

    const markerOptions = computed(() => ({
      position: {
        lat: props.latitude,
        lng: props.longitude
      },
      clickable: false,
      ...(wantsMarkerIcon.value ? { icon: markerIcon.value } : {})
    }))

    return { markerOptions }
  }
})
</script>
