<template>
  <AuthenticationManager>
    <template #authenticated>
      <MainLayout>
        <router-view />
      </MainLayout>
    </template>

    <template #unauthenticated>
      <LoginPage />
    </template>
  </AuthenticationManager>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AuthenticationManager from 'components/AuthenticationManager.vue'
import MainLayout from 'layouts/MainLayout.vue'
import LoginPage from './use-case/authenticate-user/LoginPage.vue'

export default defineComponent({
  name: 'App',

  components: {
    AuthenticationManager,
    MainLayout,
    LoginPage
  }
})
</script>
