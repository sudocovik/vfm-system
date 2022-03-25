<template>
  <div>
    <NotInstalledVehicle
      v-if="vehicles.length"
      :name="vehicles[0].licensePlate()"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import NotInstalledVehicle from './NotInstalledVehicle.vue'

export default defineComponent({
  name: 'ListOfNotInstalledVehicles',

  components: {
    NotInstalledVehicle
  },

  props: {
    vehicles: {
      type: Array,
      required: true
    }
  }
})
</script>
