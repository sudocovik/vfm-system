<template>
  <q-btn
    type="submit"
    :loading="loading"
  >
    todo
  </q-btn>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LoginFormSubmitButton',

  props: {
    loading: {
      type: Boolean,
      default: false
    }
  }
})
</script>
