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
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'LoginFormEmailInput',

  props: {
    modelValue: {
      type: String,
      required: true
    }
  },

  emits: ['update:modelValue'],

  setup (props, { emit }) {
    const email = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    })

    return {
      email
    }
  }
})
</script>
