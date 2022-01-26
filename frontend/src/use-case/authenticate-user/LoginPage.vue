<template>
  <q-page class="row items-center justify-center">
    <div class="col col-11 col-sm-7 col-md-4 col-lg-3">
      <LoginForm
        :state="formState"
        v-on="formEvents"
      />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useMeta } from 'quasar'
import { useI18n } from 'vue-i18n'
import LoginForm from './LoginForm.vue'
import { FormState, LoginFormState } from './LoginFormState'
import { AuthenticateEventData, AuthenticateEventName } from './AuthenticateEvent'
import { t } from 'boot/i18n'

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

    const formState = ref<FormState>(LoginFormState.ready())
    const handleAuthenticationRequest = ({ email, password }: AuthenticateEventData) => {
      if (email.trim() === '' || password.trim() === '') {
        const validationError = LoginFormState.failure()

        if (email.trim() === '') {
          validationError.withEmailError(t('validation.required'))
        }

        if (password.trim() === '') {
          validationError.withPasswordError(t('validation.required'))
        }

        formState.value = validationError
      }
    }
    const formEvents = { [AuthenticateEventName]: handleAuthenticationRequest }

    return {
      formState,
      formEvents
    }
  }
})
</script>
