<template>
  <q-page class="q-pa-md">
    <VehicleSkeletonLoader class="q-mt-md" />
    <VehicleSkeletonLoader class="q-mt-md" />
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMeta } from 'quasar'
import { t } from 'boot/i18n'
import VehicleSkeletonLoader from './VehicleSkeletonLoader.vue'

export default defineComponent({
  name: 'RealTimeVehicleFeedPage',

  components: { VehicleSkeletonLoader },

  setup () {
    const title = t('vehicles')

    useMeta({ title: title + ' | Zara Fleet' })
  }
})
</script>
