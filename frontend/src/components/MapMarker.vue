<template>
  <GoogleMapMarker
    :options="markerOptions"
  />
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, watch } from 'vue'
import { Marker as GoogleMapMarker } from 'vue3-google-map'
import type { MapIcon } from './Map/Icon'

type MarkerOptions = {
  clickable: boolean,
  icon?: {
    url: string,
    anchor?: {
      x: number
      y: number
    }
  },
  position: {
    lat: number,
    lng: number
  }
}

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
    const markerOptions = reactive<MarkerOptions>({
      position: {
        lat: props.latitude,
        lng: props.longitude
      },
      clickable: false
    })

    const iconAnchor = (iconWidth: number, iconHeight: number) => ({
      anchor: {
        x: iconWidth / 2,
        y: iconHeight / 2
      }
    })

    if (props.icon !== undefined) {
      markerOptions.icon = {
        url: props.icon.toUrl(),
        ...(props.iconCenter ? iconAnchor(props.icon.width(), props.icon.height()) : {})
      }
    }

    watch(() => props.latitude, latitude => {
      markerOptions.position.lat = latitude
    })

    watch(() => props.longitude, longitude => {
      markerOptions.position.lng = longitude
    })

    watch(() => props.icon, icon => {
      if (icon !== undefined) {
        markerOptions.icon = {
          url: icon.toUrl(),
          ...(props.iconCenter ? iconAnchor(icon.width(), icon.height()) : {})
        }
      }
      else delete markerOptions.icon
    }, { deep: true, immediate: true })

    return {
      markerOptions
    }
  }
})
</script>
