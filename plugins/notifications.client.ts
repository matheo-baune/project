export default defineNuxtPlugin(() => {
  if (!process.client) return

  const store = useNotificationStore()
  const toast = useToast()

  // Simple polling watcher that drains the queue reactively
  watch(
    () => store.queue.length,
    () => {
      while (store.queue.length) {
        const item = store.shift()
        if (!item) break
        toast.add({
          title: item.title,
          description: item.description,
          icon: item.icon,
          timeout: item.timeout,
        })
      }
    },
    { immediate: true }
  )
})
