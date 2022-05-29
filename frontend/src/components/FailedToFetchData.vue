<template>
  <div class="text-center">
    <q-icon
      name="mdi-heart-broken"
      data-cy="icon"
      size="180px"
      color="grey-6"
    />

    <div
      data-cy="what-happened"
      class="text-h5"
    >
      {{ $t('failed-to-fetch-data') }}
    </div>

    <div class="q-mt-md">
      <q-btn
        data-cy="retry"
        icon="mdi-reload"
        outline
        color="grey-9"
        @click="$emit('retry')"
      >
        <span class="inline-block q-ml-sm">{{ $t('retry') }}</span>
      </q-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'FailedToFetchData',

  emits: ['retry']
})
</script>
