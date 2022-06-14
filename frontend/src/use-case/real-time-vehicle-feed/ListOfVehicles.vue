<template>
  <div
    data-cy="root-node"
    class="full-width column items-stretch"
  >
    <div
      class="text-h4 text-grey-7 text-weight-medium q-mb-md"
      data-cy="heading"
    >
      <span class="vertical-middle">{{ $t('vehicles') }}</span>
    </div>

    <template v-if="geoLocatedVehicles.length">
      <div
        class="vehicle-grid"
        :class="{ 'single-vehicle-view': currentSingleVehicle !== undefined }"
        style="flex: 1"
        data-cy="vehicle-container"
      >
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
          :class="{ 'vehicle-in-viewport': currentSingleVehicle === vehicle.id() }"
          @click="currentSingleVehicle = vehicle.id()"
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
    const currentSingleVehicle = ref<number | undefined>(undefined)

    void shortPoll.do(VehicleList.fetchAll, (result) => {
      if (result.length !== 0) geoLocatedVehicles.value = result
      return Promise.resolve()
    }, TWO_SECONDS)

    return {
      geoLocatedVehicles,
      currentSingleVehicle
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

.single-vehicle-view > :not(.vehicle-in-viewport)
  display: none
</style>
