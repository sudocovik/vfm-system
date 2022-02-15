<template>
  <q-page class="q-px-md q-pt-md">
    <div
      v-if="false"
      class="row justify-between"
    >
      <div class="col col-12 col-sm-5">
        <q-input
          v-model="from"
          outlined
          bg-color="white"
          @focus="showFromDatePicker = true"
          @blur="showFromDatePicker = false"
        >
          <template #append>
            <div
              v-show="showFromDatePicker"
              style="position: absolute; left: 0; right: 0; top: 56px;"
            >
              <q-date
                v-model="from"
                minimal
                class="full-width"
                bordered
                flat
              />
            </div>
          </template>
        </q-input>
      </div>

      <div class="col col-12 col-sm-5 offset-sm-2">
        <q-input
          v-model="from"
          outlined
          bg-color="white"
          @focus="showToDatePicker = true"
          @blur="showToDatePicker = false"
        >
          <template #append>
            <div
              v-show="showToDatePicker"
              style="position: absolute; left: 0; right: 0; top: 56px;"
            >
              <q-date
                v-model="from"
                minimal
                class="full-width"
                bordered
                flat
              />
            </div>
          </template>
        </q-input>
      </div>
    </div>

    <div
      class="full-width bg-red hidden"
      style="height: 400px;"
    />

    <div>
      <q-card
        class="q-pa-md shadow-1"
        @click="dialog = true"
      >
        Od 13.02.2022. do 14.02.2022.
      </q-card>
    </div>

    <q-dialog
      v-model="dialog"
      :maximized="isMobile"
      :transition-show="isMobile ? 'slide-up' : 'flip-up'"
      :transition-hide="isMobile ? 'slide-down' : 'flip-down'"
    >
      <q-date
        v-model="range"
        range
      />
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'VehicleRouteHistory',

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

    return {
      from,
      to,
      showFromDatePicker: ref(false),
      showToDatePicker: ref(false),
      dialog: ref(false),
      range: ref({ from, to }),
      isMobile
    }
  }
})
</script>
