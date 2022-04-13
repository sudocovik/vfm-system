<template>
  <q-card>
    <BaseMap :style="mapCssStyle" />

    <q-card-section class="text-h6">
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
        <span data-cy="address">Ulica Ante Starčevića 1a, 23000 Zadar, HR</span>
      </div>
      <div class="q-mt-xs">
        <span data-cy="speed">30 km/h</span>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import BaseMap from 'components/BaseMap.vue'

export const MAP_HEIGHT = 200

export default defineComponent({
  name: 'GeoLocatedVehicle',

  components: { BaseMap },

  props: {
    licensePlate: {
      type: String,
      required: true
    },

    moving: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  setup (props) {
    const icon = props.moving ? 'mdi-truck-fast' : 'mdi-truck'
    const mapCssStyle = { height: `${MAP_HEIGHT}px`, width: '100%', overflow: 'hidden' }

    return {
      icon,
      mapCssStyle
    }
  }
})
</script>
