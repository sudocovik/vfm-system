<template>
  <q-page class="q-pa-md">
    <VehicleSkeletonLoader class="q-mt-md" />
    <VehicleSkeletonLoader class="q-mt-md" />
    <NoVehiclesFound />
    <FailedToFetchData />
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMeta } from 'quasar'
import { t } from 'boot/i18n'
import VehicleSkeletonLoader from './VehicleSkeletonLoader.vue'
import NoVehiclesFound from './NoVehiclesFound.vue'
import FailedToFetchData from 'components/FailedToFetchData.vue'

export default defineComponent({
  name: 'RealTimeVehicleFeedPage',

  components: { FailedToFetchData, NoVehiclesFound, VehicleSkeletonLoader },

  setup () {
    const title = t('vehicles')

    useMeta({ title: title + ' | Zara Fleet' })
  }
})
</script>
