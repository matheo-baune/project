import { defineStore } from 'pinia'

export type ToastPayload = {
  id?: number
  title?: string
  description?: string
  color?: string
  icon?: string
  timeout?: number
}

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    queue: [] as ToastPayload[],
    _nextId: 1,
  }),
  actions: {
    push(payload: ToastPayload) {
      const id = payload.id ?? this._nextId++
      this.queue.push({ ...payload, id })
    },
    success(message: string, opts: Partial<ToastPayload> = {}) {
      this.push({ title: opts.title || 'Succès', description: message, color: opts.color || 'green', icon: opts.icon || 'i-heroicons-check-circle', timeout: opts.timeout ?? 3000 })
    },
    error(message: string, opts: Partial<ToastPayload> = {}) {
      this.push({ title: opts.title || 'Erreur', description: message, color: opts.color || 'red', icon: opts.icon || 'i-heroicons-exclamation-circle', timeout: opts.timeout ?? 5000 })
    },
    info(message: string, opts: Partial<ToastPayload> = {}) {
      this.push({ title: opts.title || 'Info', description: message, color: opts.color || 'blue', icon: opts.icon || 'i-heroicons-information-circle', timeout: opts.timeout ?? 4000 })
    },
    warning(message: string, opts: Partial<ToastPayload> = {}) {
      this.push({ title: opts.title || 'Avertissement', description: message, color: opts.color || 'yellow', icon: opts.icon || 'i-heroicons-exclamation-triangle', timeout: opts.timeout ?? 5000 })
    },
    shift() {
      return this.queue.shift()
    }
  }
})
