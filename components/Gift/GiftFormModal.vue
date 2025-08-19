<template>
  <BaseModal :is-open="isOpen" @close="$emit('close')">
    <template #header>
      <div class="flex items-center gap-3">
        <div class="shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
          <NuxtIcon name="mdi:gift-outline" class="h-6 w-6 text-indigo-600" />
        </div>
        <h3 class="text-lg leading-6 font-medium text-gray-900">{{ gift ? 'Edit Gift' : 'Add New Gift' }}</h3>
      </div>
    </template>

    <GiftForm 
      :event-id="eventId"
      :gift="gift"
      @submit="handleSubmit"
      @update="handleUpdate"
      @cancel="$emit('close')"
    />
  </BaseModal>
</template>

<script setup lang="ts">
import type { Gift } from '~/types';
import BaseModal from '~/components/ui/BaseModal.vue'

const props = defineProps<{
  isOpen: boolean;
  eventId: string;
  gift?: Gift;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'submit', gift: Omit<Gift, 'id' | 'createdBy'>): void;
  (e: 'update', id: string, gift: Partial<Omit<Gift, 'id' | 'createdBy' | 'eventId'>>): void;
}>();

const handleSubmit = (giftData: Omit<Gift, 'id' | 'createdBy'>) => {
  emit('submit', giftData);
};

const handleUpdate = (id: string, giftData: Partial<Omit<Gift, 'id' | 'createdBy' | 'eventId'>>) => {
  emit('update', id, giftData);
};
</script>