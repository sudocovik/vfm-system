<template>
  <CenteredLayout>
    <q-spinner
      color="primary"
      size="6em"
    />
  </CenteredLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CenteredLayout from 'layouts/CenteredLayout.vue'

export default defineComponent({
  name: 'TheLoadingScreen',

  components: {
    CenteredLayout
  }
})
</script>
