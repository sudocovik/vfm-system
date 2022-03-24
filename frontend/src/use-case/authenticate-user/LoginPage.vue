<template>
  <CenteredLayout>
    <div class="col col-11 col-sm-7 col-md-4 col-lg-3">
      <LoginForm
        :state="formState"
        v-on="formEvents"
      />
    </div>
  </CenteredLayout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useMeta, useQuasar } from 'quasar'
import { t } from 'boot/i18n'
import CenteredLayout from 'layouts/CenteredLayout.vue'
import LoginForm from './LoginForm.vue'
import { FormState, LoginFormState } from './LoginFormState'
import { AuthenticateEventData, AuthenticateEventName } from './AuthenticateEvent'
import { AuthenticationSuccessfulEventName } from './AuthenticationSuccessfulEvent'
import {
  AuthenticationService,
  InvalidCredentialsError,
  NetworkError,
  UndefinedServerError
} from 'src/backend/AuthenticationService'
import { SessionCookie } from './SessionCookie'

export default defineComponent({
  name: 'LoginPage',

  components: {
    CenteredLayout,
    LoginForm
  },

  setup (props, { emit }) {
    const translatedTitle: string = t('login')

    useMeta({
      title: `${translatedTitle} | Zara Fleet`
    })

    const $q = useQuasar()

    const rememberSessionForOneYear = () => {
      const sessionCookie = $q.cookies.get(SessionCookie.name)
      $q.cookies.set(SessionCookie.name, String(sessionCookie), { expires: '365d' })
    }

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
          formState.value = LoginFormState.successful()
          emit(AuthenticationSuccessfulEventName)
          rememberSessionForOneYear()
        }
        catch (e: unknown) {
          formState.value = LoginFormState.failure()

          if (e instanceof InvalidCredentialsError) {
            $q.notify(t('wrong-email-and-password'))
          }
          else if (e instanceof UndefinedServerError) {
            $q.notify(t('general-server-error'))
          }
          else if (e instanceof NetworkError) {
            $q.notify(t('network-error'))
          }
          else {
            $q.notify(t('general-application-error'))
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
