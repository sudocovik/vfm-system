<template>
  <slot
    v-if="isAuthenticated"
    name="authenticated"
  />
  <slot
    v-else-if="isNotAuthenticated"
    name="unauthenticated"
  />
  <slot
    v-else
    name="loading"
  />
</template>

<script lang="ts">
import { computed, ref } from 'vue'
import { AuthenticationService } from '../backend/AuthenticationService'

const State = {
  Loading: 0,
  Authenticated: 1,
  Unauthenticated: 2
}

export default {
  name: 'AuthenticationManager',

  setup () {
    const state = ref<number>(State.Loading)

    void AuthenticationService.check().then((isAuthenticated: boolean | undefined) => (
      state.value = isAuthenticated
        ? State.Authenticated
        : State.Unauthenticated
    ))

    const isAuthenticated = computed(() => state.value === State.Authenticated)
    const isNotAuthenticated = computed(() => state.value === State.Unauthenticated)

    return {
      isAuthenticated,
      isNotAuthenticated
    }
  }
}
</script>
