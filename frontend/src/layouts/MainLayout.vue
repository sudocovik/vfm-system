<template>
  <q-layout view="lHh Lpr lFf">
    <q-header
      class="q-px-md q-pt-md"
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
          Vozila
        </q-toolbar-title>

        <q-btn
          flat
          round
        >
          <q-icon
            name="mdi-account-circle"
            size="sm"
          />
        </q-btn>
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
        style="color: #555; height: 82px"
      >
        <q-icon
          name="mdi-map-marker-radius-outline"
          size="md"
          left
        />
        <span
          class="text-h5 q-pl-sm"
        >Zara Fleet</span>
      </div>

      <q-separator />

      <q-list>
        <q-item
          v-for="item in drawerItems"
          :key="item.fullPath"
          :to="item.fullPath"
          class="q-ma-sm rounded-borders"
          active-class="navigation-drawer-active-item"
        >
          <q-item-section
            avatar
          >
            <q-icon
              :name="item.icon"
              size="sm"
            />
          </q-item-section>

          <q-item-section>{{ item.title }}</q-item-section>
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

interface NavigationItem {
  fullPath: string
  icon: string
  title: string
}

export default defineComponent({
  name: 'MainLayout',

  setup () {
    const leftDrawerOpen = ref(false)

    const drawerItems: NavigationItem[] = [
      {
        fullPath: '/',
        icon: 'mdi-truck',
        title: 'Vozila'
      },
      {
        fullPath: '/trailers',
        icon: 'mdi-truck-trailer',
        title: 'Prikolice'
      },
      {
        fullPath: '/drivers',
        icon: 'mdi-account-tie',
        title: 'Vozači'
      },
      {
        fullPath: '/reminders',
        icon: 'mdi-alarm',
        title: 'Podsjetnici'
      }
    ]

    return {
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      drawerItems
    }
  }
})
</script>
