<template>
  <div>
    <VehicleSkeleton class="q-mt-md" />
    <VehicleSkeleton class="q-mt-md" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import VehicleSkeleton from './VehicleSkeleton.vue'

export default defineComponent({
  name: 'VehiclesLoadingIndicator',
  components: {
    VehicleSkeleton
  }
})
</script>
