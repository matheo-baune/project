<template>
  <Teleport to="body">
    <div v-if="model" class="fixed inset-0 overflow-y-auto" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Overlay -->
        <transition name="fade" appear>
          <div
            class="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/80 transition-opacity z-40"
            aria-hidden="true"
            @click="onBackdrop"
          />
        </transition>

        <!-- Panel -->
        <transition name="scale-fade" appear>
          <div
            class="relative z-50 inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle"
            :class="panelWidth"
          >
            <!-- Header -->
            <div v-if="$slots.header || title" class="px-4 pt-5 pb-3 sm:px-6">
              <div class="flex items-start justify-between">
                <div class="mr-6">
                  <slot name="header">
                    <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">{{ title }}</h3>
                  </slot>
                </div>
                <button v-if="showClose" @click="close" type="button" class="rounded-md text-gray-400 hover:text-gray-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500">
                  <span class="sr-only">Close</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Body -->
            <div class="px-4 pb-4 sm:p-6 sm:pb-4">
              <slot />
            </div>

            <!-- Footer -->
            <div v-if="$slots.footer" class="bg-gray-50 dark:bg-gray-900/40 px-4 py-3 sm:px-6">
              <div class="sm:flex sm:flex-row-reverse">
                <slot name="footer" />
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount } from 'vue'

interface Props {
  modelValue?: boolean
  isOpen?: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showClose?: boolean
  closeOnBackdrop?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  isOpen: undefined,
  size: 'md',
  showClose: true,
  closeOnBackdrop: true,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
  (e: 'open'): void
}>()

const model = computed({
  get: () => (props.modelValue !== undefined ? props.modelValue : !!props.isOpen),
  set: (v: boolean) => emit('update:modelValue', v),
})

const panelWidth = computed(() => {
  switch (props.size) {
    case 'sm': return 'sm:max-w-sm sm:w-full'
    case 'lg': return 'sm:max-w-2xl sm:w-full'
    case 'xl': return 'sm:max-w-4xl sm:w-full'
    default: return 'sm:max-w-lg sm:w-full'
  }
})

function close() {
  if (props.modelValue !== undefined) emit('update:modelValue', false)
  emit('close')
}

function onBackdrop() {
  if (!props.closeOnBackdrop) return
  close()
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && model.value) {
    close()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKey)
  if (model.value) emit('open')
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 150ms ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.scale-fade-enter-active, .scale-fade-leave-active { transition: opacity 150ms ease, transform 150ms ease; }
.scale-fade-enter-from, .scale-fade-leave-to { opacity: 0; transform: translateY(0.5rem) scale(0.98); }
</style>
