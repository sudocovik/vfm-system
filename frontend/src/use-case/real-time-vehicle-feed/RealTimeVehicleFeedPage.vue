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
  }
})
</script>
