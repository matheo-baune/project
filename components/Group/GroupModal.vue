<template>
  <BaseModal
    :model-value="modelValue"
    @update:modelValue="val => emit('update:modelValue', val)"
    :title="title || (mode === 'edit' ? t('groups.editGroup') : t('groups.createGroup'))"
    @close="onCancel"
  >
    <template #header>
      <div class="flex items-center gap-3">
        <div class="shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
          <NuxtIcon name="mdi:account-group-outline" class="h-6 w-6 text-indigo-600" />
        </div>
        <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
          {{ title || (mode === 'edit' ? t('groups.editGroup') : t('groups.createGroup')) }}
        </h3>
      </div>
    </template>

    <div class="sm:text-left">
      <form id="group-form" @submit.prevent="onSubmit">
        <!-- Group Name -->
        <div>
          <label for="group-name" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
            {{ t('groups.groupName') }} *
          </label>
          <div class="mt-1">
            <input
              type="text"
              name="group-name"
              id="group-name"
              v-model="localForm.name"
              required
              class="shadow-xs focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:text-white"
              :placeholder="t('dashboard.createGroup') + '...'"
            />
          </div>
        </div>

        <!-- Background (optional) -->
        <div v-if="showBackground" class="mt-4">
          <label for="group-background" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
            {{ t('groups.groupBackground') }}
          </label>
          <div class="mt-1">
            <input
              type="url"
              name="group-background"
              id="group-background"
              v-model="localForm.background"
              class="shadow-xs focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:text-white"
              placeholder="https://example.com/image.jpg"
            />
            <div v-if="localForm.background" class="mt-2">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Preview</p>
              <img :src="localForm.background" alt="Background preview" class="h-32 w-full object-cover border border-gray-200 rounded-md" />
            </div>
          </div>
          <p class="mt-1 text-xs text-gray-500">
            Optional: Add a URL to a background image for your group
          </p>
        </div>
      </form>
    </div>

    <template #footer>
      <UiButton form="group-form" type="submit" variant="primary" :disabled="loading || !localForm.name">
        <template #icon>
          <NuxtIcon v-if="loading" name="line-md:loading-twotone-loop" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
        </template>
        {{ submitLabel || (mode === 'edit' ? t('groups.editGroup') : t('groups.createGroup')) }}
      </UiButton>
      <UiButton class="sm:ml-3 sm:mt-0 mt-3 mx-2" variant="secondary" type="button" @click="onCancel">
        {{ t('common.cancel') }}
      </UiButton>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, reactive, watch, onMounted, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';
import type { User } from '~/types';
import BaseModal from '~/components/ui/BaseModal.vue'
import UiButton from '~/components/ui/UiButton.vue'

interface GroupFormLike {
  name: string;
  background?: string;
  members: User[];
}

const props = defineProps<{
  modelValue: boolean;
  mode?: 'create' | 'edit';
  title?: string;
  submitLabel?: string;
  loading?: boolean;
  initialGroup?: GroupFormLike;
  showBackground?: boolean;
  creatorId?: string;
  allowRemoveCreator?: boolean;
  showMembersEditor?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'submit', payload: GroupFormLike): void;
  (e: 'cancel'): void;
}>();

const { t } = useI18n();

const mode = computed(() => props.mode ?? 'create');
const loading = computed(() => props.loading);
const showBackground = computed(() => props.showBackground);

const localForm = reactive<GroupFormLike>({
  name: props.initialGroup?.name || '',
  background: props.initialGroup?.background || '',
  members: props.initialGroup?.members ? props.initialGroup.members.map(m => ({ ...m })) : []
});

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      // Reset form from initial props on open
      localForm.name = props.initialGroup?.name || '';
      localForm.background = props.initialGroup?.background || '';
      localForm.members = props.initialGroup?.members ? props.initialGroup.members.map(m => ({ ...m })) : [];
    }
  }
);

watch(
  () => props.initialGroup,
  (val) => {
    if (props.modelValue) {
      localForm.name = val?.name || '';
      localForm.background = val?.background || '';
      localForm.members = val?.members ? val.members.map(m => ({ ...m })) : [];
    }
  },
  { deep: true }
);

const onSubmit = () => {
  if (!localForm.name) return;
  // Filter incomplete members: require at least email
  const cleanedMembers = localForm.members.filter(m => m && m.email);
  emit('submit', {
    name: localForm.name,
    background: localForm.background,
    members: cleanedMembers as User[]
  });
};

const onCancel = () => {
  emit('update:modelValue', false);
  emit('cancel');
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.modelValue) {
    onCancel();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>
