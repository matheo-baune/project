<template>
  <div
    class="flex items-center justify-center gap-3"
    role="status"
    :aria-label="ariaLabel || (label || 'Loading')"
    aria-live="polite"
  >
    <NuxtIcon
      :name="icon"
      :class="iconClasses"
      aria-hidden="true"
    />
    <span v-if="label" class="text-sm text-gray-600 dark:text-gray-300">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  // Spinner size keywords or an explicit pixel size
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number
  // Tailwind text color classes applied to the spinner
  color?: string
  // Optional descriptive label rendered to the right of the spinner
  label?: string
  // Override icon name. Defaults to FontAwesome spinner
  icon?: string
  // Optional ARIA label override
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'text-indigo-600',
  icon: 'fa6-solid:spinner',
})

const sizeClass = computed(() => {
  if (typeof props.size === 'number') {
    // Using inline style via class is tricky; fallback to closest size class
    const px = props.size
    if (px <= 12) return 'h-3 w-3'
    if (px <= 16) return 'h-4 w-4'
    if (px <= 20) return 'h-5 w-5'
    if (px <= 24) return 'h-6 w-6'
    if (px <= 32) return 'h-8 w-8'
    return 'h-10 w-10'
  }
  switch (props.size) {
    case 'xs': return 'h-3 w-3'
    case 'sm': return 'h-4 w-4'
    case 'lg': return 'h-8 w-8'
    case 'xl': return 'h-10 w-10'
    default: return 'h-6 w-6' // md
  }
})

const iconClasses = computed(() => [
  'animate-spin',
  sizeClass.value,
  props.color,
].join(' '))
</script>
