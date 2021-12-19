<template>
  <q-input
    :model-value="value"
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
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LoginFormEmailInput',

  props: {
    value: {
      type: String,
      required: true
    }
  }
})
</script>
