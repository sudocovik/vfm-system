<template>
  <q-page class="q-px-md q-pt-md">
    <div class="row justify-between">
      <div class="col col-12 col-sm-5">
        <q-date
          v-model="from"
          class="full-width"
          minimal
        />
      </div>

      <div class="col col-12 col-sm-5 offset-sm-2">
        <q-date
          v-model="to"
          class="full-width"
          minimal
        />
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'VehicleRouteHistory',

  props: {
    vehicleId: {
      type: String,
      required: true
    }
  },

  setup () {
    return {
      from: ref('2022/02/12'),
      to: ref('2022/02/13')
    }
  }
})
</script>
