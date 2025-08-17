<template>
  <div class="bg-white shadow rounded-lg p-8 text-center dark:bg-gray-800 dark:border dark:border-gray-700">
    <div class="mx-auto">
      <slot name="icon">
        <!-- default icon slot (optional) -->
      </slot>
    </div>
    <h3 class="mt-2 text-lg font-medium text-gray-900 dark:text-white">{{ title }}</h3>
    <p v-if="description" class="mt-1 text-sm text-gray-500 dark:text-gray-300">
      {{ description }}
    </p>
    <div v-if="$slots.action || actionLabel" class="mt-6">
      <slot name="action">
        <UiButton v-if="actionTo" :to="actionTo" variant="primary">
          <template #icon>
            <slot name="action-icon" />
          </template>
          {{ actionLabel }}
        </UiButton>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import UiButton from './UiButton.vue'

interface Props {
  title: string
  description?: string
  actionTo?: string | Record<string, any>
  actionLabel?: string
}

defineProps<Props>()
</script>
