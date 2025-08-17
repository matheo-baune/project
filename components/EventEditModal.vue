<template>
  <BaseModal :is-open="isOpen" :title="'Edit Event'" @close="$emit('close')">
    <EventEditForm 
      :event="event"
      @update="handleUpdate"
      @cancel="$emit('close')"
    />
  </BaseModal>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import type { Event } from '~/types';
import BaseModal from '~/components/ui/BaseModal.vue'

const props = defineProps<{
  isOpen: boolean;
  event: Event;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'update', id: string, name: string, date: string, background?: string): void;
}>();

const handleUpdate = (id: string, name: string, date: string, background?: string) => {
  emit('update', id, name, date, background);
};
</script>