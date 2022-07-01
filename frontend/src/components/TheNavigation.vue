<template>
  <q-drawer
    :model-value="true"
    behavior="desktop"
    mini
    data-cy="drawer"
  >
    <div data-cy="item">
      <div data-cy="item-name">
        {{ $t('vehicles') }}
      </div>

      <a
        href="/"
        data-cy="item-url"
      />

      <q-icon
        name="mdi-truck"
      />
    </div>

    <div data-cy="item">
      <div data-cy="item-name">
        {{ $t('trailers') }}
      </div>

      <a
        href="/trailers"
        data-cy="item-url"
      />

      <q-icon
        name="mdi-truck-trailer"
      />
    </div>

    <div data-cy="item">
      <div data-cy="item-name">
        {{ $t('drivers') }}
      </div>

      <a
        href="/drivers"
        data-cy="item-url"
      />

      <q-icon
        name="mdi-account-tie-hat"
      />
    </div>

    <div data-cy="item">
      <div data-cy="item-name">
        {{ $t('services') }}
      </div>

      <a
        href="/services"
        data-cy="item-url"
      />

      <q-icon
        name="mdi-hammer-wrench"
      />
    </div>

    <div data-cy="item">
      <div data-cy="item-name">
        {{ $t('notifications') }}
      </div>

      <a
        href="/notifications"
        data-cy="item-url"
      />

      <q-icon
        name="mdi-bell"
      />
    </div>

    <div data-cy="item">
      <div data-cy="item-name">
        {{ $t('settings') }}
      </div>

      <a
        href="/settings"
        data-cy="item-url"
      />

      <q-icon
        name="mdi-cog"
      />
    </div>

    <div data-cy="item">
      <div data-cy="item-name">
        {{ $t('logout') }}
      </div>

      <a
        href="/logout"
        data-cy="item-url"
      />

      <q-icon
        name="mdi-power"
      />
    </div>
  </q-drawer>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TheNavigation'
})
</script>
