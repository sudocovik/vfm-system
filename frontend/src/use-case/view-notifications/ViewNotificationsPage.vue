<template>
  <q-page class="q-pa-md flex flex-center">
    <div class="text-center">
      <q-icon
        name="mdi-bell-sleep"
        size="150px"
        color="grey-6"
      />
      <div class="text-h5">
        {{ $t('no-notifications') }}
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMeta } from 'quasar'
import { t } from 'boot/i18n'

export default defineComponent({
  name: 'ViewNotificationsPage',

  setup () {
    const title = t('notifications')
    useMeta({ title: title + ' | Zara Fleet' })
  }
})
</script>
