<template>
  <q-card
    class="column items-stretch"
    data-cy="vehicle-card"
  >
    <BaseMap
      :interactive="false"
      :center="mapCenter"
      :zoom="14"
      :render-p-o-i="false"
      style="flex: 1; overflow: hidden;"
    >
      <MapMarker
        :latitude="latitude"
        :longitude="longitude"
        :icon="ignitionAndMovementAwareIcon"
        :icon-center="true"
      />
    </BaseMap>

    <q-card-section
      class="text-h6"
      :style="{ color: ignitionBasedColor }"
      data-cy="title"
    >
      <q-icon
        :name="icon"
        size="sm"
        data-cy="icon"
        left
      />
      <span
        class="vertical-middle"
        data-cy="license-plate"
      >{{ licensePlate }}</span>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <div>
        <span data-cy="address">{{ address }}</span>
      </div>
      <div class="q-mt-xs">
        <span data-cy="speed">{{ speedInKph }} km/h</span>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, watch } from 'vue'
import { BaseMap, icon as MarkerIcon, MapMarker } from 'components/Map'
import { colors as StatusColors, createIcon as VehicleMapIcon, size as mapIconSize } from './VehicleMapIcon'
import { Speed } from 'src/support/measurement-units/speed'

export default defineComponent({
  name: 'GeoLocatedVehicle',

  components: {
    BaseMap,
    MapMarker
  },

  props: {
    latitude: {
      type: Number,
      required: true
    },

    longitude: {
      type: Number,
      required: true
    },

    licensePlate: {
      type: String,
      required: true
    },

    address: {
      type: String,
      required: true
    },

    speed: {
      type: Speed,
      required: true
    },

    moving: {
      type: Boolean,
      required: true
    },

    ignition: {
      type: Boolean,
      required: true
    },

    course: {
      type: Number,
      required: true
    },

    syncCenter: {
      type: Boolean,
      default: true
    }
  },

  setup (props) {
    const ignitionBasedColor = computed(() => props.ignition ? StatusColors.green.stroke : StatusColors.yellow.fill)
    const icon = computed(() => props.moving ? 'mdi-truck-fast' : 'mdi-truck')
    const ignitionAndMovementAwareIcon = computed(() =>
      new MarkerIcon.SVG(VehicleMapIcon(props.moving, props.ignition, props.course))
        .havingWidth(mapIconSize)
        .havingHeight(mapIconSize)
    )
    const speedInKph = computed(() => Math.round(props.speed.toKph()))

    const mapCenter = reactive({ lat: Number(props.latitude), lng: Number(props.longitude) })
    const latitudeAndLongitude = computed(() => ({ latitude: props.latitude, longitude: props.longitude }))
    watch(latitudeAndLongitude, ({ latitude, longitude }) => {
      if (props.syncCenter) {
        mapCenter.lat = latitude
        mapCenter.lng = longitude
      }
    })

    return {
      icon,
      ignitionAndMovementAwareIcon,
      ignitionBasedColor,
      speedInKph,
      mapCenter
    }
  }
})
</script>
