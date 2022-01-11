<template>
  <q-input
    v-model="password"
    type="password"
    :label="$t('password')"
    outlined
  >
    <template #prepend>
      <q-icon name="mdi-lock" />
    </template>
  </q-input>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'LoginFormPasswordInput',

  props: {
    modelValue: {
      type: String,
      required: true
    }
  },

  emits: ['update:modelValue'],

  setup (props, { emit }) {
    const password = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    })

    return {
      password
    }
  }
})
</script>
