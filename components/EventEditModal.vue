<template>
  <div v-if="isOpen" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div 
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
        aria-hidden="true"
        @click="$emit('close')"
      ></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                Edit Event
              </h3>
              <div class="mt-4">
                <EventEditForm 
                  :event="event"
                  @update="handleUpdate"
                  @cancel="$emit('close')"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import type { Event } from '~/types';

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