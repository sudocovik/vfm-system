<template>
  <q-page class="q-pa-md" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMeta } from 'quasar'
import { t } from 'boot/i18n'

export default defineComponent({
  name: 'RealTimeVehicleFeedPage',

  setup () {
    const title = t('vehicles')

    useMeta({ title: title + ' | Zara Fleet' })
  }
})
</script>
