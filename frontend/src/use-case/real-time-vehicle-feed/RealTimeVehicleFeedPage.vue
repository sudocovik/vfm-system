<template>
  <q-page class="q-pa-md flex items-stretch">
    <div>Just testing service worker update process</div>

    <div
      v-if="isLoadingState"
      data-cy="loading-indicator"
      class="full-width"
    >
      <VehiclesLoadingIndicator />
    </div>

    <div
      v-if="isEmptyState"
      data-cy="no-vehicles"
      class="full-width flex items-center justify-center"
    >
      <NoVehiclesFound />
    </div>

    <div
      v-if="isErrorState"
      data-cy="fetch-failure"
      class="full-width flex items-center justify-center"
    >
      <FailedToFetchData />
    </div>

    <div
      v-if="isSuccessState"
      data-cy="vehicle-list"
      class="full-width flex items-stretch"
    >
      <ListOfVehicles :vehicles="vehicles" />
    </div>
  </q-page>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useMeta } from 'quasar'
import { t } from 'boot/i18n'
import { StateMachine, STATES } from './StateMachine'
import FailedToFetchData from 'components/FailedToFetchData.vue'
import ListOfVehicles from './ListOfVehicles.vue'
import NoVehiclesFound from './NoVehiclesFound.vue'
import VehiclesLoadingIndicator from './VehiclesLoadingIndicator.vue'
import { GeoLocatedVehicle, VehicleList } from 'src/backend/VehicleService'

export default defineComponent({
  name: 'RealTimeVehicleFeedPage',

  components: {
    FailedToFetchData,
    ListOfVehicles,
    NoVehiclesFound,
    VehiclesLoadingIndicator
  },

  setup () {
    const title = t('vehicles')

    useMeta({ title: title + ' | Zara Fleet' })

    const state = ref(StateMachine.currentState())
    StateMachine.onTransition = () => (state.value = StateMachine.currentState())

    const isLoadingState = computed(() => state.value === STATES.LOADING)
    const isEmptyState = computed(() => state.value === STATES.EMPTY)
    const isErrorState = computed(() => state.value === STATES.ERROR)
    const isSuccessState = computed(() => state.value === STATES.SUCCESS)

    const vehicles = ref<GeoLocatedVehicle[]>([])
    void VehicleList.fetchAll().then(result => {
      const isSuccess = result.length > 0
      isSuccess && (vehicles.value = result)
      StateMachine.transitionTo(isSuccess ? STATES.SUCCESS : STATES.EMPTY)
    }).catch(() => StateMachine.transitionTo(STATES.ERROR))

    return {
      isLoadingState,
      isEmptyState,
      isErrorState,
      isSuccessState,
      vehicles
    }
  }
})
</script>
