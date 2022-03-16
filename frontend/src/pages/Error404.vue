<template>
  <q-page class="text-grey-8 text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 15vh">
        404
      </div>

      <div
        class="text-h4"
        style="opacity:.4"
      >
        Oops. Nothing here...
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        to="/"
        label="Go Home"
        no-caps
      />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Error404'
})
</script>
