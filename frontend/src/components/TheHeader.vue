<template>
  <q-header>
    <q-btn
      icon="mdi-menu"
      @click="notifyParentMenuToggleWasRequested"
    />
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
