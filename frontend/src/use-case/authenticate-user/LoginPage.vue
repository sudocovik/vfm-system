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
import { useMeta, useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import LoginForm from './LoginForm.vue'
import { FormState, LoginFormState } from './LoginFormState'
import { AuthenticateEventData, AuthenticateEventName } from './AuthenticateEvent'
import { t } from 'boot/i18n'
import { AuthenticationService, InvalidCredentialsError, UndefinedServerError } from 'src/backend/AuthenticationService'

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

    const $q = useQuasar()
    const formState = ref<FormState>(LoginFormState.ready())
    const handleAuthenticationRequest = async ({ email, password }: AuthenticateEventData) => {
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
      else {
        formState.value = LoginFormState.inProgress()
        try {
          await AuthenticationService.login(email, password)
        }
        catch (e: unknown) {
          formState.value = LoginFormState.failure()

          if (e instanceof InvalidCredentialsError) {
            $q.notify(t('wrong-email-and-password'))
          }
          else if (e instanceof UndefinedServerError) {
            $q.notify(t('general-server-error'))
          }
          else {
            $q.notify(t('network-error'))
          }
        }
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
