<template>
  <q-page class="q-pa-md">
    <div class="title text-h4 text-weight-medium">
      {{ title }}
    </div>

    <ListOfNotInstalledVehicles
      :vehicles="vehiclesWithoutPosition"
      class="q-mt-md"
    />
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMeta } from 'quasar'
import { t } from 'boot/i18n'
import ListOfNotInstalledVehicles from './ListOfNotInstalledVehicles.vue'
import { VehicleWithoutPosition } from '../../backend/VehicleService'

export default defineComponent({
  name: 'RealTimeVehicleFeedPage',
  components: { ListOfNotInstalledVehicles },
  setup () {
    const title = t('vehicles')

    useMeta({ title: title + ' | Zara Fleet' })

    const vehiclesWithoutPosition = [
      new VehicleWithoutPosition(1, 'ZD000AA', '000000', false),
      new VehicleWithoutPosition(2, 'ZD111BB', '111111', false),
      new VehicleWithoutPosition(3, 'ZD222CC', '222222', false)
    ]

    return {
      title,
      vehiclesWithoutPosition
    }
  }
})
</script>
