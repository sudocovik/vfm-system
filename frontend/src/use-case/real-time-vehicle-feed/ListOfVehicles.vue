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
      if (result.length !== 0) {
        geoLocatedVehicles.value[0] = result[0]
        geoLocatedVehicles.value[1] = result[1]
      }
      return Promise.resolve()
    }, TWO_SECONDS)

    return {
      geoLocatedVehicles
    }
  }
})
</script>
