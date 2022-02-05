<template>
  <AuthenticationManager>
    <template #loading>
      <div id="loading">
        LOADING
      </div>
    </template>

    <template #authenticated>
      <div id="authenticated">
        AUTHENTICATED
      </div>
    </template>

    <template #unauthenticated="{ setAuthenticated }">
      <div
        id="unauthenticated"
        @dblclick="setAuthenticated"
      >
        UNAUTHENTICATED
      </div>
    </template>
  </AuthenticationManager>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AuthenticationManager from '../AuthenticationManager.vue'

export default defineComponent({
  name: 'AuthenticationManagerWrapper',

  components: {
    AuthenticationManager
  }
})
</script>
