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
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                Reserve Gift
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  You're about to reserve "{{ gift?.title }}". Please enter your name so others know who reserved this gift.
                </p>
              </div>
              <div class="mt-4">
                <label for="name" class="block text-sm font-medium text-gray-700">
                  Your Name *
                </label>
                <div class="mt-1">
                  <input 
                    type="text" 
                    name="name" 
                    id="name" 
                    v-model="name"
                    required
                    class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" 
                    placeholder="John Doe"
                    ref="nameInput"
                  />
                </div>
                <p v-if="error" class="mt-2 text-sm text-red-600">
                  {{ error }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button 
            type="button" 
            @click="handleReserve"
            :disabled="loading || !name.trim()"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
            :class="{ 'opacity-50 cursor-not-allowed': loading || !name.trim() }"
          >
            <svg 
              v-if="loading" 
              class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Reserve
          </button>
          <button 
            type="button" 
            @click="$emit('close')"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
import type { Gift } from '~/types';
import { useUserStore } from '~/stores/user';

const props = defineProps<{
  isOpen: boolean;
  gift?: Gift;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'reserve', giftId: string, name: string): void;
}>();

const userStore = useUserStore();
const name = ref('');
const loading = ref(false);
const error = ref('');
const nameInput = ref<HTMLInputElement | null>(null);

// Initialize name with user's name if available
onMounted(() => {
  if (userStore.user?.name) {
    name.value = userStore.user.name;
  }
});

// Focus the name input when the modal opens
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    // Use nextTick to ensure the DOM has updated
    nextTick(() => {
      nameInput.value?.focus();
    });
  }
});

// Handle reservation
const handleReserve = async () => {
  if (!name.value.trim()) {
    error.value = 'Please enter your name';
    return;
  }

  if (!props.gift) {
    error.value = 'No gift selected';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    emit('reserve', props.gift.id, name.value.trim());
  } catch (err) {
    error.value = 'Failed to reserve gift';
    console.error(err);
  } finally {
    loading.value = false;
  }
};
</script>
