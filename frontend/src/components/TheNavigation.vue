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
        :src="require('/src/assets/logo.svg')"
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
          to="/"
          data-cy="item-vehicles"
        >
          <q-tooltip
            anchor="center right"
            self="center left"
            :offset="[10, 0]"
            transition-show="jump-right"
            transition-hide="jump-left"
          >
            <span class="text-subtitle2 text-weight-regular">{{ $t('vehicles') }}</span>
          </q-tooltip>

          <q-avatar icon="mdi-truck" />
        </q-item>

        <q-item
          to="/trailers"
          data-cy="item-trailers"
        >
          <q-tooltip
            anchor="center right"
            self="center left"
            :offset="[10, 0]"
            transition-show="jump-right"
            transition-hide="jump-left"
          >
            <span class="text-subtitle2 text-weight-regular">{{ $t('trailers') }}</span>
          </q-tooltip>

          <q-avatar icon="mdi-truck-trailer" />
        </q-item>

        <q-item
          to="/drivers"
          data-cy="item-drivers"
        >
          <q-tooltip
            anchor="center right"
            self="center left"
            :offset="[10, 0]"
            transition-show="jump-right"
            transition-hide="jump-left"
          >
            <span class="text-subtitle2 text-weight-regular">{{ $t('drivers') }}</span>
          </q-tooltip>

          <q-avatar icon="mdi-account-tie-hat" />
        </q-item>

        <q-item
          to="/services"
          data-cy="item-services"
        >
          <q-tooltip
            anchor="center right"
            self="center left"
            :offset="[10, 0]"
            transition-show="jump-right"
            transition-hide="jump-left"
          >
            <span class="text-subtitle2 text-weight-regular">{{ $t('services') }}</span>
          </q-tooltip>

          <q-avatar icon="mdi-hammer-wrench" />
        </q-item>

        <q-item
          to="/notifications"
          data-cy="item-notifications"
        >
          <q-tooltip
            anchor="center right"
            self="center left"
            :offset="[10, 0]"
            transition-show="jump-right"
            transition-hide="jump-left"
          >
            <span class="text-subtitle2 text-weight-regular">{{ $t('notifications') }}</span>
          </q-tooltip>

          <q-avatar icon="mdi-bell" />
        </q-item>

        <q-item
          to="/settings"
          data-cy="item-settings"
        >
          <q-tooltip
            anchor="center right"
            self="center left"
            :offset="[10, 0]"
            transition-show="jump-right"
            transition-hide="jump-left"
          >
            <span class="text-subtitle2 text-weight-regular">{{ $t('settings') }}</span>
          </q-tooltip>

          <q-avatar icon="mdi-cog" />
        </q-item>

        <q-item
          to="/logout"
          data-cy="item-logout"
        >
          <q-tooltip
            anchor="center right"
            self="center left"
            :offset="[10, 0]"
            transition-show="jump-right"
            transition-hide="jump-left"
          >
            <span class="text-subtitle2 text-weight-regular">{{ $t('logout') }}</span>
          </q-tooltip>

          <q-avatar icon="mdi-power" />
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
        to="/"
        icon="mdi-truck"
        :label="$t('vehicles')"
        data-cy="tab-vehicles"
      />

      <q-route-tab
        to="/notifications"
        icon="mdi-bell"
        :label="$t('notifications')"
        data-cy="tab-notifications"
      />

      <q-route-tab
        to="/menu"
        icon="mdi-menu"
        :label="$t('menu')"
        data-cy="tab-menu"
      />
    </q-tabs>
  </q-footer>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TheNavigation'
})
</script>
