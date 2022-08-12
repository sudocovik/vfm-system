<template>
  <q-page
    class="q-pa-md flex items-stretch"
    data-cy="page"
  >
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
      <FailedToFetchData @retry="tryFetchingVehiclesAgain" />
    </div>

    <div
      v-if="isSuccessState"
      data-cy="vehicle-list"
      class="full-width flex items-stretch"
    >
      <ListOfVehicles :vehicles="allVehicles" />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useMeta, useQuasar } from 'quasar'
import { t } from 'boot/i18n'
import { GeoLocatedVehicle, VehicleList } from 'src/backend/VehicleService'
import { usePageStateMachine } from './usePageStateMachine'
import FailedToFetchData from 'components/FailedToFetchData.vue'
import ListOfVehicles from './ListOfVehicles.vue'
import NoVehiclesFound from './NoVehiclesFound.vue'
import VehiclesLoadingIndicator from './VehiclesLoadingIndicator.vue'

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

    const $q = useQuasar()

    const allVehicles = ref<GeoLocatedVehicle[]>([])
    const areVehiclesEmpty = () => allVehicles.value.length === 0
    const fetchVehicles = async () => {
      const result = await VehicleList.fetchAll()
      if (result.length) {
        allVehicles.value = result
      }
    }
    const notifyUserProblemsWithBackgroundRefreshOccurred = () => {
      const hideNotification = $q.notify({
        attrs: {
          'data-cy': 'failure-notification'
        },
        message: t('failed-to-refresh-vehicles'),
        timeout: 0
      })

      return () => hideNotification()
    }

    const {
      isLoadingState,
      isEmptyState,
      isErrorState,
      isSuccessState,
      tryFetchingVehiclesAgain
    } = usePageStateMachine({ fetchVehicles, areVehiclesEmpty, notifyUserProblemsWithBackgroundRefreshOccurred })

    return {
      allVehicles,
      isLoadingState,
      isEmptyState,
      isErrorState,
      isSuccessState,
      tryFetchingVehiclesAgain
    }
  }
})
</script>
