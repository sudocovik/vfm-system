<template>
  <q-layout view="lHh Lpr lFf">
    <q-header
      class="q-pa-md"
      style="background-color: transparent"
    >
      <q-toolbar
        class="rounded-borders shadow-1"
        style="color: #5E6367; background-color: #fff"
      >
        <q-btn
          flat
          dense
          round
          icon="mdi-menu"
          aria-label="Menu"
          style="color: #3B4042"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title class="text-subtitle1">
          Quasar App
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :breakpoint="1023"
      class="bg-white shadow-1"
    >
      <div
        class="row items-center q-px-md"
        style="height: 82px"
      >
        <q-icon
          name="mdi-map-marker-radius-outline"
          size="md"
          color="primary"
        />
        <span
          class="text-h5 q-pl-sm"
          style="color: #555;"
        >Zara Fleet</span>
      </div>

      <q-separator />

      <q-list>
        <q-item to="asd">
          <q-item-section
            avatar
          >
            <q-icon
              name="mdi-truck"
              size="sm"
            />
          </q-item-section>

          <q-item-section>Vozila</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <slot />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'MainLayout',

  setup () {
    const leftDrawerOpen = ref(false)

    return {
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>
