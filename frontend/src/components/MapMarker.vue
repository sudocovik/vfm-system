<template>
  <GoogleMapMarker
    :options="markerOptions"
  />
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from 'vue'
import { Marker as GoogleMapMarker } from 'vue3-google-map'

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
    }
  },

  setup (props) {
    const markerOptions = reactive({
      position: {
        lat: props.latitude,
        lng: props.longitude
      },
      clickable: false
    })

    watch(() => props.latitude, latitude => {
      markerOptions.position.lat = latitude
    })

    watch(() => props.longitude, longitude => {
      markerOptions.position.lng = longitude
    })

    return {
      markerOptions
    }
  }
})
</script>
