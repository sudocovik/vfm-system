<template>
  <q-tabs
    no-caps
    active-color="primary"
    indicator-color="transparent"
    class="bg-white text-grey-9"
  >
    <q-route-tab
      to="/"
      exact
      name="vehicles"
      icon="mdi-truck"
      label="Vozila"
    />
    <q-route-tab
      to="/trailers"
      exact
      name="trailers"
      icon="mdi-truck-trailer"
      label="Prikolice"
    />
    <q-route-tab
      to="/notifications"
      exact
      name="notifications"
      icon="mdi-bell"
      label="Obavijesti"
    />
    <q-route-tab
      to="/menu"
      exact
      name="menu"
      icon="mdi-menu"
      label="Meni"
    />
  </q-tabs>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TheNavigationBarDummy'
})
</script>
