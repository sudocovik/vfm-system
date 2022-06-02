<template>
  <q-page class="q-pa-md">
    <VehiclesLoadingIndicator v-if="isLoadingState" />
    <NoVehiclesFound v-if="isEmptyState" />
    <FailedToFetchData v-if="isErrorState" />
    <ListOfVehicles v-if="isSuccessState" />
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

    return {
      isLoadingState,
      isEmptyState,
      isErrorState,
      isSuccessState
    }
  }
})
</script>
