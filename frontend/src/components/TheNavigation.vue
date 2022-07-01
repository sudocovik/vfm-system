<template>
  <q-drawer
    :model-value="true"
    data-cy="drawer"
  >
    <div>Test data</div>
  </q-drawer>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TheNavigation'
})
</script>
