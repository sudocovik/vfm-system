<template>
  <q-drawer
    :model-value="$q.screen.gt.xs"
    behavior="desktop"
    mini
    class="bg-grey-2 text-grey-7 shadow-3 overflow-hidden column no-wrap"
    data-cy="drawer"
  >
    <div
      class="bg-white q-pa-sm"
      data-cy="logo"
    >
      <img
        :src="logo"
        alt=""
        width="32"
        height="36"
        class="block q-mx-auto"
      >
    </div>

    <q-separator />

    <q-scroll-area
      :vertical-thumb-style="{ width: '4px', right: '1px' }"
      style="flex: 1"
      data-cy="scrollable-area"
    >
      <q-list>
        <q-item
          v-for="({ url, icon }, id) in desktopItems"
          :key="id"
          :to="url"
          :data-cy="`item-${id}`"
        >
          <q-tooltip
            anchor="center right"
            self="center left"
            :offset="[10, 0]"
            transition-show="jump-right"
            transition-hide="jump-left"
          >
            <span class="text-subtitle2 text-weight-regular">{{ $t(id) }}</span>
          </q-tooltip>

          <q-avatar :icon="icon" />
        </q-item>
      </q-list>
    </q-scroll-area>
  </q-drawer>

  <q-footer
    :model-value="$q.screen.lt.sm"
    class="bg-grey-2 text-grey-7 shadow-3"
    data-cy="footer"
  >
    <q-tabs
      no-caps
      active-color="primary"
      indicator-color="transparent"
      data-cy="tabs"
    >
      <q-route-tab
        v-for="({ url, icon }, id) in mobileItems"
        :key="id"
        :to="url"
        :icon="icon"
        :label="$t(id)"
        :data-cy="`tab-${id}`"
      />
    </q-tabs>
  </q-footer>
</template>

<script>
import { defineComponent } from 'vue'
import logo from 'src/assets/logo.svg'

export default defineComponent({
  name: 'TheNavigation',

  setup () {
    const desktopItems = {
      vehicles: {
        url: '/',
        icon: 'mdi-truck'
      },
      trailers: {
        url: '/trailers',
        icon: 'mdi-truck-trailer'
      },
      drivers: {
        url: '/drivers',
        icon: 'mdi-account-tie-hat'
      },
      services: {
        url: '/services',
        icon: 'mdi-hammer-wrench'
      },
      notifications: {
        url: '/notifications',
        icon: 'mdi-bell'
      },
      settings: {
        url: '/settings',
        icon: 'mdi-cog'
      },
      logout: {
        url: '/logout',
        icon: 'mdi-power'
      }
    }

    const mobileItems = {
      vehicles: desktopItems.vehicles,
      notifications: desktopItems.notifications,
      menu: {
        url: '/menu',
        icon: 'mdi-menu'
      }
    }

    return {
      desktopItems,
      mobileItems,
      logo
    }
  }
})
</script>
