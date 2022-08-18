<template>
  <div
    v-if="updateAvailable"
    class="flex items-center bg-primary text-white q-pa-sm justify-between"
  >
    <div class="q-mx-md">
      <span>{{ $t('update-available') }}</span>
    </div>
    <div>
      <q-btn
        flat
        color="white"
        :label="$t('install')"
        icon="mdi-update"
        data-cy="install-updates"
        @click="activateUpdates"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onUnmounted, ref } from 'vue'
import { ServiceWorkerUpdated } from 'src/support/pwa/event-detail'

export default defineComponent({
  name: 'TheUpdateNotification',

  setup () {
    const updateAvailable = ref(false)
    const activateUpdates = ref(() => { /* should be replaced with function received from event */ })

    const notifyUpdatesAvailable = (e: CustomEvent<ServiceWorkerUpdated>) => {
      updateAvailable.value = true
      activateUpdates.value = e.detail.activateUpdates
    }

    document.addEventListener('service-worker-updated', notifyUpdatesAvailable)

    onUnmounted(() => {
      // This code is untested because Cypress Runner does not support component unmounting ATM.
      // Write tests when it gets supported
      document.removeEventListener('service-worker-updated', notifyUpdatesAvailable)
    })

    return {
      updateAvailable,
      activateUpdates
    }
  }
})
</script>
