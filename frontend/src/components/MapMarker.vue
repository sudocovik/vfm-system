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
    url: string
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

    if (props.icon !== undefined) {
      markerOptions.icon = {
        url: props.icon?.toUrl()
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
          url: icon.toUrl()
        }
      }
      else delete markerOptions.icon
    })

    return {
      markerOptions
    }
  }
})
</script>
