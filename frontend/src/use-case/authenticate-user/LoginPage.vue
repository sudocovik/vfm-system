<template>
  <q-page class="row items-center justify-center">
    <div class="col col-11 col-sm-7 col-md-4 col-lg-3">
      <LoginForm :state="formState" />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMeta } from 'quasar'
import { useI18n } from 'vue-i18n'
import LoginForm from './LoginForm.vue'
import { FormState, LoginFormState } from './LoginFormState'

export default defineComponent({
  name: 'LoginPage',

  components: {
    LoginForm
  },

  setup () {
    const translatedTitle: string = useI18n().t('login')

    useMeta({
      title: `${translatedTitle} | Zara Fleet`
    })

    const formState = <FormState>LoginFormState.ready()

    return {
      formState
    }
  }
})
</script>
