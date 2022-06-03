<template>
  <div data-cy="root-node" />
  <template v-if="geoLocatedVehicles.length">
    <GeoLocatedVehicle
      :license-plate="vehicle.licensePlate()"
      :latitude="vehicle.latitude()"
      :longitude="vehicle.longitude()"
      :address="vehicle.address()"
      :speed="vehicle.speed()"
      :course="vehicle.course()"
    />
  </template>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import GeoLocatedVehicle from './GeoLocatedVehicle.vue'
import { GeoLocatedVehicle as Vehicle } from 'src/backend/VehicleService'

export default defineComponent({
  name: 'ListOfVehicles',

  components: { GeoLocatedVehicle },

  props: {
    vehicles: {
      type: Array as PropType<Vehicle[]>,
      required: true
    }
  },

  setup (props) {
    const vehicle = computed<Vehicle>(() => props.vehicles[0])
    const geoLocatedVehicles = props.vehicles.filter(vehicle => vehicle instanceof Vehicle)

    return {
      geoLocatedVehicles,
      vehicle
    }
  }
})
</script>
