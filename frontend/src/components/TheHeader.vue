<template>
  <q-header class="q-px-md q-pt-md bg-transparent">
    <q-toolbar
      class="rounded-borders shadow-1 bg-white"
      style="color: #5E6367"
    >
      <q-btn
        flat
        dense
        round
        icon="mdi-menu"
        style="color: #3B4042"
        @click="notifyParentMenuToggleWasRequested"
      />
    </q-toolbar>
  </q-header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { MenuToggleEventName } from './MenuToggleEvent'

export default defineComponent({
  name: 'TheHeader',

  emits: [MenuToggleEventName],

  setup (props, { emit }) {
    const notifyParentMenuToggleWasRequested = () => emit(MenuToggleEventName)

    return { notifyParentMenuToggleWasRequested }
  }
})
</script>
