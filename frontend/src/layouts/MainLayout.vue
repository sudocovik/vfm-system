<template>
  <q-layout view="hHh Lpr lFf">
    <TheHeader
      v-if="false"
      @[MenuToggle]="toggleLeftDrawer"
    />

    <q-page-container>
      <slot />
    </q-page-container>

    <q-footer>
      <TheNavigationBarDummy />
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import TheHeader from 'components/TheHeader.vue'
import { MenuToggleEventName as MenuToggle } from 'components/MenuToggleEvent'
import TheNavigationBarDummy from 'components/TheNavigationBarDummy.vue'

export default defineComponent({
  name: 'MainLayout',

  components: {
    TheHeader,
    TheNavigationBarDummy
  },

  setup () {
    const leftDrawerOpen = ref(false)

    return {
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      MenuToggle
    }
  }
})
</script>
