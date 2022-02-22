<template>
  <q-page class="q-px-md q-pt-md column">
    <template v-if="isLoading">
      <q-skeleton type="QInput" />

      <q-card
        class="q-my-md q-pa-md flex"
        style="flex: 1"
      >
        <q-skeleton
          type="rect"
          style="flex: 1"
        />
      </q-card>
    </template>
    <template v-else>
      <q-card
        class="q-pa-md shadow-1 bg-primary text-white cursor-pointer"
        role="button"
        @click="dialog = true"
      >
        <q-icon
          name="mdi-calendar"
          size="sm"
          left
        />
        <span class="vertical-middle">
          <span class="text-weight-bold">Veljača 13, 2022</span> do <span class="text-weight-bold">Veljača 14, 2022</span>
        </span>
      </q-card>

      <q-card
        class="q-my-md q-pa-md flex"
        style="flex: 1"
      >
        <div
          class="relative-position"
          style="flex: 1"
        >
          <GoogleMap
            :center="{ lat: 44.107666, lng: 15.242819 }"
            :zoom="9"
            api-key="AIzaSyAAuB9sJjZZpvBj6jd7czdJSPangVxKZaU"
            style="position: absolute; top: 0; left: 0; bottom: 0; right: 0"
          />
        </div>
      </q-card>

      <q-dialog
        v-model="dialog"
        :maximized="isMobile"
        :transition-show="isMobile ? 'slide-up' : undefined"
        :transition-hide="isMobile ? 'slide-down' : undefined"
      >
        <q-date
          v-model="range"
          range
        >
          <div class="flex">
            <q-space />
            <q-btn
              color="primary"
              flat
              @click="dialog = false"
            >
              Odustani
            </q-btn>
            <q-btn
              color="primary"
              flat
            >
              Spremi
            </q-btn>
          </div>
        </q-date>
      </q-dialog>
    </template>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useQuasar } from 'quasar'
import { GoogleMap } from 'vue3-google-map'

export default defineComponent({
  name: 'VehicleRouteHistory',

  components: { GoogleMap },

  props: {
    vehicleId: {
      type: String,
      required: true
    }
  },

  setup () {
    const from = ref('2022/02/12')
    const to = ref('2022/02/13')

    const $q = useQuasar()
    const isMobile = $q.screen.lt.md

    const isLoading = ref(true)

    setTimeout(() => (isLoading.value = false), 1000)

    return {
      from,
      to,
      showFromDatePicker: ref(false),
      showToDatePicker: ref(false),
      dialog: ref(false),
      range: ref({ from, to }),
      isMobile,
      isLoading
    }
  }
})
</script>
