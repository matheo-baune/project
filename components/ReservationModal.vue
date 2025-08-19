<template>
  <BaseModal :is-open="isOpen" :title="t('gifts.reserveGift')" @close="$emit('close')">
    <template #header>
      <div class="flex items-center gap-3">
        <div class="shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
        </div>
        <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">{{ t('gifts.reserveGift') }}</h3>
      </div>
    </template>

    <div class="sm:text-left">
      <p class="text-sm text-gray-500 dark:text-gray-300">
        {{ t('gifts.reserveExplain', { title: gift?.title || '' }) }}
      </p>
      <div class="mt-4">
        <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
          {{ t('common.yourName') }} *
        </label>
        <div class="mt-1">
          <input
            type="text"
            name="name"
            id="name"
            v-model="name"
            required
            class="shadow-xs focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:text-black"
            :placeholder="t('common.yourName')"
            ref="nameInput"
          />
        </div>
        <p v-if="error" class="mt-2 text-sm text-red-600">
          {{ error }}
        </p>
      </div>
    </div>

    <template #footer>
      <UiButton
        variant="primary"
        :disabled="loading || !name.trim()"
        @click="handleReserve"
      >
        <template #icon>
          <NuxtIcon v-if="loading" name="fa6-solid:spinner" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
        </template>
        {{ t('gifts.reserve') }}
      </UiButton>
      <UiButton class="sm:ml-3 sm:mt-0 mt-3" variant="secondary" @click="$emit('close')">{{ t('common.cancel') }}</UiButton>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, onMounted, watch, nextTick } from 'vue';
import type { Gift } from '~/types';
import { useUserStore } from '~/stores';
import BaseModal from '~/components/ui/BaseModal.vue'
import UiButton from '~/components/ui/UiButton.vue'

const props = defineProps<{
  isOpen: boolean;
  gift?: Gift;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'reserve', giftId: string, name: string): void;
}>();

const { t } = useI18n()
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
