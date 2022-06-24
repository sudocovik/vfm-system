<template>
  <div
    data-cy="root-node"
    class="full-width column items-stretch"
  >
    <div
      class="text-h4 text-grey-7 text-weight-medium q-mb-md"
      data-cy="heading"
    >
      <q-btn
        v-show="isSingleVehicleModeActive"
        icon="mdi-chevron-left"
        size="lg"
        class="q-mr-xs"
        dense
        unelevated
        rounded
        data-cy="back-button"

        @click="leaveSingleVehicleMode"
      />

      <span class="vertical-middle">{{ $t('vehicles') }}</span>
    </div>

    <template v-if="geoLocatedVehicles.length">
      <div
        class="vehicle-grid"
        style="flex: 1"
      >
        <GeoLocatedVehicle
          v-if="isSingleVehicleModeActive"
          :key="`single-vehicle-${currentSingleVehicle.id()}`"

          :license-plate="currentSingleVehicle.licensePlate()"
          :latitude="currentSingleVehicle.latitude()"
          :longitude="currentSingleVehicle.longitude()"
          :address="currentSingleVehicle.address()"
          :speed="currentSingleVehicle.speed()"
          :ignition="currentSingleVehicle.ignition()"
          :moving="currentSingleVehicle.moving()"
          :course="currentSingleVehicle.course()"
          :map-interactive="true"
          :sync-center="false"

          data-cy="single-vehicle-mode"
        />
        <GeoLocatedVehicle
          v-for="vehicle in geoLocatedVehicles"
          v-show="!isSingleVehicleModeActive"
          :key="vehicle.id()"

          :license-plate="vehicle.licensePlate()"
          :latitude="vehicle.latitude()"
          :longitude="vehicle.longitude()"
          :address="vehicle.address()"
          :speed="vehicle.speed()"
          :ignition="vehicle.ignition()"
          :moving="vehicle.moving()"
          :course="vehicle.course()"
          :map-interactive="false"
          :sync-center="true"
          :data-cy="`vehicle-${vehicle.id()}`"
          class="cursor-pointer"

          @click="enterSingleVehicleMode(vehicle)"
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, nextTick } from 'vue'
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
    const allVehicles = ref(props.vehicles)
    const geoLocatedVehicles = computed(() => allVehicles.value.filter(vehicle => vehicle instanceof Vehicle) as Vehicle[])

    void shortPoll.do(VehicleList.fetchAll, (result) => {
      if (result.length !== 0) allVehicles.value = result
      return Promise.resolve()
    }, TWO_SECONDS)

    let scrollTopBeforeEnteringSingleVehicleMode = 0
    const singleVehicleModeVehicleId = ref<number | undefined>(undefined)
    const currentSingleVehicle = computed(() => geoLocatedVehicles.value.find(vehicle => vehicle.id() === singleVehicleModeVehicleId.value))
    const isSingleVehicleModeActive = computed(() => singleVehicleModeVehicleId.value !== undefined)
    const enterSingleVehicleMode = (vehicle: Vehicle) => {
      scrollTopBeforeEnteringSingleVehicleMode = window.scrollY
      singleVehicleModeVehicleId.value = vehicle.id()
    }
    const leaveSingleVehicleMode = async () => {
      singleVehicleModeVehicleId.value = undefined
      await nextTick()
      window.scrollTo({ top: scrollTopBeforeEnteringSingleVehicleMode })
    }

    return {
      geoLocatedVehicles,
      isSingleVehicleModeActive,
      currentSingleVehicle,
      enterSingleVehicleMode,
      leaveSingleVehicleMode
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
