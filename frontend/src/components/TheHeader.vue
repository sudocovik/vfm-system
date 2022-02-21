<template>
  <q-header class="q-px-md q-pt-md bg-transparent">
    <q-toolbar
      class="rounded-borders shadow-1 bg-white"
      style="color: #5E6367"
    >
      <HamburgerIcon
        flat
        dense
        round
        style="color: #3B4042"
        @click="notifyParentMenuToggleWasRequested"
      />
    </q-toolbar>
  </q-header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { MenuToggleEventName } from './MenuToggleEvent'
import HamburgerIcon from './HamburgerIcon.vue'

export default defineComponent({
  name: 'TheHeader',

  components: { HamburgerIcon },

  emits: [MenuToggleEventName],

  setup (props, { emit }) {
    const notifyParentMenuToggleWasRequested = () => emit(MenuToggleEventName)

    return { notifyParentMenuToggleWasRequested }
  }
})
</script>
