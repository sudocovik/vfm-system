<script lang="ts">
import { defineComponent, onUnmounted, ref } from 'vue'

export default defineComponent({
  name: 'TheUpdateActivator',

  setup () {
    if ('serviceWorker' in navigator) {
      const refreshing = ref(false)

      const reloadPage = () => {
        if (refreshing.value) return
        refreshing.value = true
        window.location.reload()
      }

      navigator.serviceWorker.addEventListener('controllerchange', reloadPage)

      onUnmounted(() => {
        navigator.serviceWorker.removeEventListener('controllerchange', reloadPage)
      })

      return () => null
    }
  }
})
</script>
