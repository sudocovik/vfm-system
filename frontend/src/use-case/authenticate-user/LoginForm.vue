<template>
  <q-card>
    <form
      novalidate
      @submit.prevent="notifyParentAuthorizationIsRequested"
    >
      <q-card-section>
        <LoginFormEmailInput
          v-model="email"
          :error="emailError"
          :disabled="formIsInProgress || formIsCompleted"
        />

        <div style="height: 10px" />

        <LoginFormPasswordInput
          v-model="password"
          :error="passwordError"
          :disabled="formIsInProgress || formIsCompleted"
        />
      </q-card-section>

      <q-card-actions align="center">
        <LoginFormSubmitButton
          :disabled="formIsCompleted"
          :loading="formIsInProgress"
        />
      </q-card-actions>
    </form>
  </q-card>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import LoginFormEmailInput from './LoginFormEmailInput.vue'
import LoginFormPasswordInput from './LoginFormPasswordInput.vue'
import { Failure, InProgress, Ready, Successful } from './LoginFormState'
import LoginFormSubmitButton from './LoginFormSubmitButton.vue'
import { AuthenticateEventData, AuthenticateEventName } from './AuthenticateEvent'

export default defineComponent({
  name: 'LoginForm',

  components: {
    LoginFormSubmitButton,
    LoginFormPasswordInput,
    LoginFormEmailInput
  },

  props: {
    state: {
      type: [Successful, Failure, Ready, InProgress],
      required: true
    }
  },

  emits: [AuthenticateEventName],

  setup (props, { emit }) {
    const email = ref<string>('')
    const emailError = computed<string>(() => props.state.emailError())

    const password = ref<string>('')
    const passwordError = computed<string>(() => props.state.passwordError())

    const formIsInProgress = computed<boolean>(() => props.state instanceof InProgress)
    const formIsCompleted = computed<boolean>(() => props.state instanceof Successful)

    const notifyParentAuthorizationIsRequested = () => {
      const eventData: AuthenticateEventData = {
        email: email.value,
        password: password.value
      }
      emit(AuthenticateEventName, eventData)
    }

    return {
      email,
      emailError,
      password,
      passwordError,
      formIsInProgress,
      formIsCompleted,
      notifyParentAuthorizationIsRequested
    }
  }
})
</script>
