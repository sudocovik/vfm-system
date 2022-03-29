<template>
  <q-card>
    <q-card-section>
      <span class="vehicle-license-plate text-h6">{{ name }}</span>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NotInstalledVehicle',

  props: {
    name: {
      type: String,
      required: true
    }
  }
})
</script>
