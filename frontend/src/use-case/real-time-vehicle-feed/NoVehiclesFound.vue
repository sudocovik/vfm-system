<template>
  <div class="text-center">
    <q-icon
      name="mdi-human-dolly"
      data-cy="icon"
      size="180px"
      color="grey-6"
    />
    <div
      data-cy="current-state"
      class="text-h5"
    >
      {{ $t('ordering-gps-trackers') }}
    </div>
    <div data-cy="next-steps">
      {{ $t('gps-ordering-notification') }}
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'NoVehiclesFound'
}
</script>
