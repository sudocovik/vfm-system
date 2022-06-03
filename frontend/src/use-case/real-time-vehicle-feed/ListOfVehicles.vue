<template>
  <div data-cy="root-node">
    <template v-if="geoLocatedVehicles.length">
      <GeoLocatedVehicle
        v-for="vehicle in geoLocatedVehicles"
        :key="vehicle.id()"

        :license-plate="vehicle.licensePlate()"
        :latitude="vehicle.latitude()"
        :longitude="vehicle.longitude()"
        :address="vehicle.address()"
        :speed="vehicle.speed()"
        :ignition="vehicle.ignition()"
        :moving="vehicle.moving()"
        :course="vehicle.course()"
        class="q-mt-md"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import GeoLocatedVehicle from './GeoLocatedVehicle.vue'
import { GeoLocatedVehicle as Vehicle } from 'src/backend/VehicleService'

export default defineComponent({
  name: 'ListOfVehicles',

  components: { GeoLocatedVehicle },

  props: {
    vehicles: {
      type: Array,
      required: true
    }
  },

  setup (props) {
    const geoLocatedVehicles = props.vehicles.filter(vehicle => vehicle instanceof Vehicle) as Vehicle[]

    return {
      geoLocatedVehicles
    }
  }
})
</script>
