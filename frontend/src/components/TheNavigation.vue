<template>
  <q-drawer
    :model-value="true"
    mini
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
