<template>
  <q-page class="q-pa-md">
    <VehiclesLoadingIndicator />
    <NoVehiclesFound />
    <FailedToFetchData />
    <ListOfVehicles />
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMeta } from 'quasar'
import { t } from 'boot/i18n'
import VehiclesLoadingIndicator from './VehiclesLoadingIndicator.vue'
import NoVehiclesFound from './NoVehiclesFound.vue'
import FailedToFetchData from 'components/FailedToFetchData.vue'
import ListOfVehicles from './ListOfVehicles.vue'

export default defineComponent({
  name: 'RealTimeVehicleFeedPage',

  components: {
    ListOfVehicles,
    FailedToFetchData,
    NoVehiclesFound,
    VehiclesLoadingIndicator
  },

  setup () {
    const title = t('vehicles')

    useMeta({ title: title + ' | Zara Fleet' })
  }
})
</script>
