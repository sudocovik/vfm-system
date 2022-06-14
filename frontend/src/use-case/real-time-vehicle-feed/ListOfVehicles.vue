<template>
  <div
    data-cy="root-node"
    class="full-width flex items-stretch"
  >
    <template v-if="geoLocatedVehicles.length">
      <div class="vehicle-grid">
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
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import GeoLocatedVehicle from './GeoLocatedVehicle.vue'
import { GeoLocatedVehicle as Vehicle, VehicleList } from 'src/backend/VehicleService'
import { shortPoll } from 'src/support/short-poll'

const TWO_SECONDS = 2000

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
    const geoLocatedVehicles = ref(props.vehicles.filter(vehicle => vehicle instanceof Vehicle) as Vehicle[])

    void shortPoll.do(VehicleList.fetchAll, (result) => {
      if (result.length !== 0) geoLocatedVehicles.value = result
      return Promise.resolve()
    }, TWO_SECONDS)

    return {
      geoLocatedVehicles
    }
  }
})
</script>

<style lang="sass" scoped>
.vehicle-grid
  display: grid
  grid-template-columns: 1fr
  grid-gap: 16px // equal to .q-ma-md
  width: 100%
  grid-auto-rows: minmax(350px, auto)

@media (min-width: $breakpoint-sm-min)
  .vehicle-grid
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr))
</style>
