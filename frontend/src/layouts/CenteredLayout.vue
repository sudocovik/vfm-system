<template>
  <BlankLayout>
    <q-page class="row items-center justify-center">
      <slot />
    </q-page>
  </BlankLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BlankLayout from './BlankLayout.vue'

export default defineComponent({
  name: 'CenteredLayout',

  components: {
    BlankLayout
  }
})
</script>
