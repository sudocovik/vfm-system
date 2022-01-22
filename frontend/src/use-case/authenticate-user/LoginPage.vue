<template>
  <div>Test</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMeta } from 'quasar'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'LoginPage',

  setup () {
    const translatedTitle: string = useI18n().t('login')

    useMeta({
      title: `${translatedTitle} | Zara Fleet`
    })
  }
})
</script>
