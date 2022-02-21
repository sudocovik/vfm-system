<template>
  <q-layout view="lHh Lpr lFf">
    <TheHeader @[MenuToggle]="$emit(MenuToggle)" />
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TheHeader from '../TheHeader.vue'
import { MenuToggleEventName as MenuToggle } from '../MenuToggleEvent'

export default defineComponent({
  name: 'TheHeaderWrapper',

  components: {
    TheHeader
  },

  emits: [MenuToggle],

  setup: () => ({ MenuToggle })
})
</script>
