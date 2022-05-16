<template>
  <q-card>
    <BaseMap
      :style="mapCssStyle"
      :interactive="false"
      :center="{ lat: latitude, lng: longitude }"
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
        <span data-cy="speed">30 km/h</span>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { BaseMap, icon as MarkerIcon, MapMarker } from 'components/Map'
import { colors as StatusColors, createIcon as VehicleMapIcon, size as mapIconSize } from './VehicleMapIcon'

export const MAP_HEIGHT = 200

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

    moving: {
      type: Boolean,
      required: false,
      default: false
    },

    ignition: {
      type: Boolean,
      required: false,
      default: false
    },

    course: {
      type: Number,
      required: false,
      default: 0
    }
  },

  setup (props) {
    const ignitionBasedColor = computed(() => props.ignition ? StatusColors.green.stroke : StatusColors.yellow.fill)
    const icon = computed(() => props.moving ? 'mdi-truck-fast' : 'mdi-truck')
    const mapCssStyle = { height: `${MAP_HEIGHT}px`, width: '100%', overflow: 'hidden' }
    const ignitionAndMovementAwareIcon = computed(() =>
      new MarkerIcon.SVG(VehicleMapIcon(props.moving, props.ignition, props.course))
        .havingWidth(mapIconSize)
        .havingHeight(mapIconSize)
    )

    return {
      icon,
      mapCssStyle,
      ignitionAndMovementAwareIcon,
      ignitionBasedColor
    }
  }
})
</script>
