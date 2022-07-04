<template>
  <q-drawer
    :model-value="true"
    behavior="desktop"
    mini
    class="bg-grey-2 text-grey-7 shadow-3 overflow-hidden column"
    data-cy="drawer"
  >
    <div
      class="bg-white q-pa-sm flex flex-center"
      data-cy="logo"
    >
      <img
        :src="require('/src/assets/logo.svg')"
        alt=""
        width="32"
        height="36"
        class="block"
      >
    </div>

    <q-separator />

    <q-scroll-area
      style="flex: 1"
      data-cy="scrollable-area"
    >
      <q-list>
        <q-item
          to="/"
          data-cy="item-vehicles"
        >
          <div class="hidden">
            {{ $t('vehicles') }}
          </div>

          <q-avatar icon="mdi-truck" />
        </q-item>

        <q-item
          to="/trailers"
          data-cy="item-trailers"
        >
          <div class="hidden">
            {{ $t('trailers') }}
          </div>

          <q-avatar icon="mdi-truck-trailer" />
        </q-item>

        <q-item
          to="/drivers"
          data-cy="item-drivers"
        >
          <div class="hidden">
            {{ $t('drivers') }}
          </div>

          <q-avatar icon="mdi-account-tie-hat" />
        </q-item>

        <q-item
          to="/services"
          data-cy="item-services"
        >
          <div class="hidden">
            {{ $t('services') }}
          </div>

          <q-avatar icon="mdi-hammer-wrench" />
        </q-item>

        <q-item
          to="/notifications"
          data-cy="item-notifications"
        >
          <div class="hidden">
            {{ $t('notifications') }}
          </div>

          <q-avatar icon="mdi-bell" />
        </q-item>

        <q-item
          to="/settings"
          data-cy="item-settings"
        >
          <div class="hidden">
            {{ $t('settings') }}
          </div>

          <q-avatar icon="mdi-cog" />
        </q-item>

        <q-item
          to="/logout"
          data-cy="item-logout"
        >
          <div class="hidden">
            {{ $t('logout') }}
          </div>

          <q-avatar icon="mdi-power" />
        </q-item>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TheNavigation'
})
</script>
