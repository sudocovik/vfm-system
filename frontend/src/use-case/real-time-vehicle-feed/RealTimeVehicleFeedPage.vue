<template>
  <q-page class="q-pa-md">
    <div class="title text-h4 text-weight-medium">
      {{ title }}
    </div>

    <GeoLocatedVehicle
      license-plate="ZD547GC"
      address="Ulica Ante Starčevića 2, 23000 Zadar, HR"
      :latitude="44.107205"
      :longitude="15.241929"
      :ignition="true"
      :moving="false"
      :course="50"
      :speed="Speed.fromKnots(0)"
    />

    <GeoLocatedVehicle
      license-plate="ZD815LK"
      address="E55, 30174 Venezia, IT"
      :latitude="45.519794"
      :longitude="12.252026"
      :ignition="true"
      :moving="true"
      :course="220"
      :speed="Speed.fromKnots(30)"
      class="q-mt-md"
    />

    <GeoLocatedVehicle
      license-plate="ZD409AJ"
      address="93354 Siegenburg, DE"
      :latitude="48.739043"
      :longitude="11.856284"
      :ignition="false"
      :moving="false"
      :course="220"
      :speed="Speed.fromKnots(0)"
      class="q-mt-md"
    />

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
import GeoLocatedVehicle from './GeoLocatedVehicle.vue'
import { Speed } from 'src/support/measurement-units/speed'

export default defineComponent({
  name: 'RealTimeVehicleFeedPage',
  components: { GeoLocatedVehicle, ListOfNotInstalledVehicles },
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
      vehiclesWithoutPosition,
      Speed
    }
  }
})
</script>
