<template>
  <AuthenticationManager>
    <template #loading>
      <TheLoadingScreen />
    </template>

    <template #authenticated>
      <MainLayout>
        <template #header>
          <TheUpdateNotification />
        </template>

        <router-view />
      </MainLayout>
    </template>

    <template #unauthenticated="{ setAuthenticated }">
      <LoginPage v-on="{ [onAuthenticationSuccessful]: setAuthenticated }" />
    </template>
  </AuthenticationManager>

  <TheUpdateActivator />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AuthenticationManager from 'components/AuthenticationManager.vue'
import MainLayout from 'layouts/MainLayout.vue'
import LoginPage from './use-case/authenticate-user/LoginPage.vue'
import { AuthenticationSuccessfulEventName } from './use-case/authenticate-user/AuthenticationSuccessfulEvent'
import TheUpdateNotification from 'components/TheUpdateNotification.vue'
import TheUpdateActivator from 'components/TheUpdateActivator.vue'
import TheLoadingScreen from 'components/TheLoadingScreen.vue'

export default defineComponent({
  name: 'App',

  components: {
    TheLoadingScreen,
    TheUpdateActivator,
    TheUpdateNotification,
    AuthenticationManager,
    MainLayout,
    LoginPage
  },

  setup: () => ({ onAuthenticationSuccessful: AuthenticationSuccessfulEventName })
})
</script>
