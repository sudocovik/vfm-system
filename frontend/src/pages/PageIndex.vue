<template>
  <q-page class="q-px-md q-pt-md">
    <q-card
      v-for="i in 5"
      :key="i"
      class="q-mb-md full-height"
    >
      <div style="overflow: hidden">
        <GoogleMap
          ref="mapReference"
          style="width: 100%; height: 200px; overflow: hidden;"
          api-key="AIzaSyAAuB9sJjZZpvBj6jd7czdJSPangVxKZaU"
          :center="center"
          :zoom="9"
          disable-default-ui
          gesture-handling="none"
          :styles="[{
            featureType: 'poi',
            elementType: 'labels',
            stylers: [
              { visibility: 'off' }
            ]
          }]"
        >
          <Marker
            :options="markerOptions"
          />

          <!-- <Marker :options="{ position: { lat: 44.107666, lng: 15.242819 } }" /> -->
        </GoogleMap>

      <q-card-section>
        <div class="row justify-between items-center q-mb-sm">
          <div class="text-h6 text-green-7">
            <q-icon
              name="mdi-truck-fast"
              size="sm"
              left
            />
            <span style="vertical-align: middle">ZD{{ i }}00{{ ['', ''].map(() => String.fromCharCode(64 + i)).join('') }}</span>
          </div>
          <div>
            <span style="display: none; vertical-align: middle">U pokretu</span>
          </div>
        </div>

        <div>
          <span>Ulica Ante Starčevića 6</span>
          <span> &bullet; </span>
          <span>30 km/h</span>
        </div>
        <div>
          <span>Ažurirano prije {{ 5 + (Math.floor(Math.random() * 60)) }} sekundi</span>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions>
        <q-btn
          flat
          color="primary"
          :to="'/vehicle/' + i + '/history'"
        >
          <q-icon
            name="mdi-history"
            left
          />
          <span>Povijest</span>
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import { GoogleMap, Marker } from 'vue3-google-map'

interface Position {
  lat: number,
  lng: number
}

interface MarkerOptions {
  position: Position,
  icon: {
    path: string,
    scale: number,
    anchor: { x: number, y: number },
    rotation: number,
    fillColor: string,
    fillOpacity: number,
    strokeWeight: number,
    strokeColor: string
  }
}

export default defineComponent({
  name: 'PageIndex',

  components: {
    Marker,
    GoogleMap
  },

  setup () {
    const mapReference = ref<InstanceType<typeof GoogleMap>>()

    const center = ref({ lat: 44.107666, lng: 15.242819 })

    const markerPosition = ref<Position>({ lat: 44.107666, lng: 15.242819 })
    const markerRotation = ref<number>(60)

    const markerOptions = computed<MarkerOptions>(() => ({
      position: markerPosition.value,
      icon: {
        path: 'M12,2L4.5,20.29L5.21,21L12,18L18.79,21L19.5,20.29L12,2Z',
        scale: 1.5,
        fillColor: '#43a047',
        fillOpacity: 1,
        strokeWeight: 1,
        strokeColor: '#2c712e',
        rotation: markerRotation.value,
        anchor: { x: 12, y: 12 }
      }
    }))

    onMounted(() => {
      setTimeout(() => {
        const newPosition: Position = { lat: 44.06296445030817, lng: 15.010724191272907 }
        markerPosition.value = newPosition
        center.value = newPosition

        markerRotation.value = 180
      }, 5000)
    })

    return { mapReference, markerOptions, center }
  }
})
</script>
