<template>
  <q-layout view="LHh Lpr lFf">
    <q-header
      class="bg-transparent text-black"
      data-cy="header"
    >
      <slot name="header" />
    </q-header>

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
