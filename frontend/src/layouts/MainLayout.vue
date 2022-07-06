<template>
  <q-layout view="hHh Lpr lFf">
    <q-page-container>
      <slot />
    </q-page-container>

    <TheNavigation />
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TheNavigation from 'components/TheNavigation.vue'

export default defineComponent({
  name: 'MainLayout',

  components: {
    TheNavigation
  }
})
</script>
