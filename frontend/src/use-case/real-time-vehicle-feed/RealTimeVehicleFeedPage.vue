<template>
  <q-page class="q-pa-md">
    <VehicleSkeleton class="q-mt-md" />
    <VehicleSkeleton class="q-mt-md" />
    <NoVehiclesFound />
    <FailedToFetchData />
    <ListOfVehicles />
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMeta } from 'quasar'
import { t } from 'boot/i18n'
import VehicleSkeleton from './VehicleSkeleton.vue'
import NoVehiclesFound from './NoVehiclesFound.vue'
import FailedToFetchData from 'components/FailedToFetchData.vue'
import ListOfVehicles from './ListOfVehicles.vue'

export default defineComponent({
  name: 'RealTimeVehicleFeedPage',

  components: {
    ListOfVehicles,
    FailedToFetchData,
    NoVehiclesFound,
    VehicleSkeleton
  },

  setup () {
    const title = t('vehicles')

    useMeta({ title: title + ' | Zara Fleet' })
  }
})
</script>
