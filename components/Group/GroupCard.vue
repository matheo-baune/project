<template>
  <component
    :is="displayMode === 'large' ? GroupCardLarge : GroupCardRegular"
    :group="group"
    @click="$emit('click', $event)"
    @edit="$emit('edit', $event)"
    @delete="$emit('delete', $event)"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Group } from '~/types'
import GroupCardRegular from '~/components/Group/GroupCardRegular.vue'
import GroupCardLarge from '~/components/Group/GroupCardLarge.vue'

const props = defineProps<{ group: Group; displayMode?: 'card' | 'large' }>()
const emit = defineEmits<{
  (e: 'click', group: Group): void
  (e: 'edit', group: Group): void
  (e: 'delete', id: string): void
}>()

const displayMode = computed(() => props.displayMode || 'card')
const group = computed(() => props.group)
</script>
