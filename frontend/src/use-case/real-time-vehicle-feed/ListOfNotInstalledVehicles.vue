<template>
  <NotInstalledVehicle
    v-for="vehicle in notInstalledVehicles"
    :key="vehicle.id()"
    :name="vehicle.licensePlate()"
    :class="$attrs['class']"
  />
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import NotInstalledVehicle from './NotInstalledVehicle.vue'
import { VehicleWithoutPosition } from 'src/backend/VehicleService'

export default defineComponent({
  name: 'ListOfNotInstalledVehicles',

  components: {
    NotInstalledVehicle
  },

  inheritAttrs: false,

  props: {
    vehicles: {
      type: Array as PropType<VehicleWithoutPosition[]>,
      required: true
    }
  },

  setup (props) {
    return {
      notInstalledVehicles: computed(() => props.vehicles.filter(vehicle => vehicle instanceof VehicleWithoutPosition))
    }
  }
})
</script>
