import { createMachine } from 'xstate'
import { useMachine } from '@xstate/vue'
import { computed } from 'vue'

type MachineRequiredArguments = {
  fetchVehicles: () => Promise<unknown>
  areVehiclesEmpty: () => boolean,
  notifyUserProblemsWithBackgroundRefreshOccurred: () => () => unknown
}

export function usePageStateMachine (args: MachineRequiredArguments) {
  const {
    fetchVehicles,
    areVehiclesEmpty,
    notifyUserProblemsWithBackgroundRefreshOccurred
  } = args

  const machine = createMachine({
    id: 'vehicle-feed',
    initial: 'loading',
    states: {
      loading: {
        invoke: {
          src: 'fetchVehicles',
          onDone: 'check_response',
          onError: 'error'
        }
      },
      empty: {},
      error: {
        on: {
          RETRY: 'loading'
        }
      },
      check_response: {
        always: [
          { target: 'empty', cond: 'areVehiclesEmpty' },
          { target: 'fetched' }
        ]
      },
      fetched: {
        type: 'compound',
        id: 'vehicle-polling',
        initial: 'polling',
        states: {
          polling: {
            invoke: {
              src: 'fetchVehicles',
              onError: 'failure',
              onDone: 'success'
            }
          },
          failure: {
            invoke: { src: 'handleRefreshFailure' },
            after: { ERROR_INTERVAL: 'polling' }
          },
          success: {
            after: { SUCCESS_INTERVAL: 'polling' }
          }
        }
      }
    },
    predictableActionArguments: true
  }, {
    guards: { areVehiclesEmpty },
    delays: { SUCCESS_INTERVAL: 4000, ERROR_INTERVAL: 10000 },
    services: {
      fetchVehicles,
      handleRefreshFailure: () => notifyUserProblemsWithBackgroundRefreshOccurred
    }
  })

  const { state, send } = useMachine(machine)

  const isLoadingState = computed(() => state.value.matches('loading'))
  const isEmptyState = computed(() => state.value.matches('empty'))
  const isErrorState = computed(() => state.value.matches('error'))
  const isSuccessState = computed(() => state.value.matches('fetched'))
  const tryFetchingVehiclesAgain = () => send('RETRY')

  return {
    isLoadingState,
    isEmptyState,
    isErrorState,
    isSuccessState,
    tryFetchingVehiclesAgain
  }
}
