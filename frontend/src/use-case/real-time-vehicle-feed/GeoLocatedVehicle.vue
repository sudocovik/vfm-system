<template>
  <q-card>
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
      >ZD000AA</span>
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

export default defineComponent({
  name: 'GeoLocatedVehicle',

  props: {
    moving: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  setup (props) {
    const icon = computed<string>(() => props.moving ? 'mdi-truck-fast' : 'mdi-truck')

    return {
      icon
    }
  }
})
</script>
