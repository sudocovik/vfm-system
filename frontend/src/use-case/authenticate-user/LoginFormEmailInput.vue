<template>
  <q-input
    v-model="email"
    type="email"
    :label="$t('email')"
    outlined
  >
    <template #prepend>
      <q-icon name="mdi-account" />
    </template>
  </q-input>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'LoginFormEmailInput',

  setup () {
    const email = ref<string>('')

    return {
      email
    }
  }
})
</script>
