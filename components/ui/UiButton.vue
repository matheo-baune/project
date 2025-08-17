<template>
  <component
    :is="componentTag"
    :to="to"
    :href="href"
    class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
    :class="computedClasses"
    @click="handleClick"
  >
    <slot name="icon">
      <!-- optional leading icon -->
    </slot>
    <span><slot>{{ label }}</slot></span>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  label?: string
  to?: string | Record<string, any>
  href?: string
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'secondary',
  disabled: false,
})

const emit = defineEmits<{
  (e: 'click', evt: MouseEvent): void
}>()

const componentTag = computed(() => {
  if (props.to) return 'NuxtLink'
  if (props.href) return 'a'
  return 'button'
})

const computedClasses = computed(() => {
  const base = [] as string[]
  if (props.variant === 'primary') {
    base.push('border border-transparent shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500')
  } else {
    base.push('border border-gray-300 shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:ring-indigo-500')
  }
  if (props.disabled) {
    base.push('opacity-50 cursor-not-allowed')
  }
  return base.join(' ')
})

function handleClick(evt: MouseEvent) {
  if (props.disabled) {
    evt.preventDefault()
    return
  }
  emit('click', evt)
}
</script>
