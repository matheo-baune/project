<template>
  <component
    :is="displayMode === 'large' ? EventCardLarge : EventCardRegular"
    :event="event"
    @delete="$emit('delete', $event)"
    @edit="$emit('edit', $event)"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Event } from '~/types'
import EventCardRegular from '~/components/Event/EventCardRegular.vue'
import EventCardLarge from '~/components/Event/EventCardLarge.vue'

const props = defineProps<{ event: Event; displayMode?: 'card' | 'large' }>()
const emit = defineEmits<{
  (e: 'delete', id: string): void
  (e: 'edit', event: Event): void
}>()

const displayMode = computed(() => props.displayMode || 'card')
const event = computed(() => props.event)
</script>
