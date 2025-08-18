<template>
  <EventModal
    :model-value="isOpen"
    mode="edit"
    :initial-event="event"
    @update:modelValue="val => { if (!val) $emit('close') }"
    @cancel="$emit('close')"
    @submit="(payload) => emit('update', payload.id || event.id, payload.name, payload.date, payload.background)"
  />
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import type { Event } from '~/types';
import EventModal from '~/components/event/EventModal.vue'

const props = defineProps<{
  isOpen: boolean;
  event: Event;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'update', id: string, name: string, date: string, background?: string): void;
}>();
</script>