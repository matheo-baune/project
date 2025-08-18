<template>
  <BaseModal
    :model-value="modelValue"
    @update:modelValue="val => emit('update:modelValue', val)"
    :title="modalTitle"
    @close="onCancel"
  >
    <template #header>
      <div class="flex items-center gap-3">
        <div class="shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
          <Icon name="heroicons-outline:calendar" class="h-6 w-6 text-indigo-600" />
        </div>
        <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
          {{ modalTitle }}
        </h3>
      </div>
    </template>

    <div class="sm:text-left">
      <form id="event-form" @submit.prevent="onSubmit" class="space-y-4">
        <!-- Event Name -->
        <div>
          <label for="event-name" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
            {{ t('events.eventName') || 'Event Name' }} *
          </label>
          <div class="mt-1">
            <input
              type="text"
              name="event-name"
              id="event-name"
              v-model="localForm.name"
              required
              class="shadow-xs focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:text-white"
              :placeholder="t('events.eventNamePlaceholder') || 'Christmas, Birthday, Wedding...'"
            />
          </div>
        </div>

        <!-- Event Date -->
        <div>
          <label for="event-date" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
            {{ t('events.eventDate') || 'Event Date' }} *
          </label>
          <div class="mt-1">
            <input
              type="date"
              name="event-date"
              id="event-date"
              v-model="localForm.date"
              required
              class="shadow-xs focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:text-black"
            />
          </div>
        </div>

        <!-- Audience -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
            {{ t('events.audience') || 'Audience' }}
          </label>
          <div class="mt-2 flex gap-4">
            <label class="inline-flex items-center gap-2 text-sm">
              <input type="radio" value="single" v-model="localForm.scope" />
              <span>{{ t('events.forOnePerson') || 'For one person' }}</span>
            </label>
            <label class="inline-flex items-center gap-2 text-sm">
              <input type="radio" value="multiple" v-model="localForm.scope" />
              <span>{{ t('events.forMultiplePeople') || 'For multiple people' }}</span>
            </label>
          </div>
          <div v-if="localForm.scope === 'single'" class="mt-3">
            <label for="target-person" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              {{ t('events.targetPerson') || 'Target person' }}
            </label>
            <select id="target-person" v-model="localForm.targetPersonId" class="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:text-black">
              <option :value="undefined">{{ t('events.selectPerson') || 'Select a person' }}</option>
              <option v-for="m in members" :key="m.id" :value="m.id">{{ m.firstname }} {{ m.lastname }}</option>
            </select>
          </div>
        </div>

        <!-- Background URL (optional) -->
        <div>
          <label for="event-background" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
            {{ t('events.eventBackground') || 'Background Image URL' }}
          </label>
          <div class="mt-1">
            <input
              type="url"
              name="event-background"
              id="event-background"
              v-model="localForm.background"
              class="shadow-xs focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:text-white"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <p class="mt-1 text-xs text-gray-500">
            {{ t('events.eventBackgroundHelp') || 'Optional: Add a URL to a background image for your event' }}
          </p>
          <div v-if="localForm.background" class="mt-2">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">{{ t('common.preview') || 'Preview' }}</p>
            <img :src="localForm.background" alt="Background preview" class="h-32 w-full object-cover border border-gray-200 rounded-md" />
          </div>
        </div>
      </form>
    </div>

    <template #footer>
      <UiButton form="event-form" type="submit" variant="primary" :disabled="loading || !localForm.name || !localForm.date">
        <template #icon>
          <Icon v-if="loading" name="line-md:loading-twotone-loop" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
        </template>
        {{ submitText }}
      </UiButton>
      <UiButton class="sm:ml-3 sm:mt-0 mt-3" variant="secondary" type="button" @click="onCancel">
        {{ t('common.cancel') || 'Cancel' }}
      </UiButton>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseModal from '~/components/ui/BaseModal.vue'
import UiButton from '~/components/ui/UiButton.vue'

interface EventLike {
  id?: string
  name: string
  date: string
  background?: string
  scope?: 'single' | 'multiple'
  targetPersonId?: string
}

interface MemberLike { id: string; firstname: string; lastname: string }

const props = defineProps<{
  modelValue: boolean
  mode?: 'create' | 'edit'
  initialEvent?: EventLike
  loading?: boolean
  title?: string
  submitLabel?: string
  members?: MemberLike[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', payload: EventLike): void
  (e: 'cancel'): void
}>()

const { t } = useI18n()

const mode = computed(() => props.mode ?? 'create')
const loading = computed(() => props.loading === true)

const localForm = reactive<EventLike>({
  id: props.initialEvent?.id,
  name: props.initialEvent?.name || '',
  date: props.initialEvent?.date ? normalizeDate(props.initialEvent.date) : today(),
  background: props.initialEvent?.background || '',
  scope: props.initialEvent?.scope || 'multiple',
  targetPersonId: props.initialEvent?.targetPersonId
})

watch(() => props.modelValue, (open) => {
  if (open) {
    localForm.id = props.initialEvent?.id
    localForm.name = props.initialEvent?.name || ''
    localForm.date = props.initialEvent?.date ? normalizeDate(props.initialEvent.date) : today()
    localForm.background = props.initialEvent?.background || ''
    localForm.scope = props.initialEvent?.scope || 'multiple'
    localForm.targetPersonId = props.initialEvent?.targetPersonId
  }
})

watch(() => props.initialEvent, (val) => {
  if (props.modelValue) {
    localForm.id = val?.id
    localForm.name = val?.name || ''
    localForm.date = val?.date ? normalizeDate(val.date) : today()
    localForm.background = val?.background || ''
    localForm.scope = val?.scope || 'multiple'
    localForm.targetPersonId = val?.targetPersonId
  }
}, { deep: true })

const modalTitle = computed(() => props.title || (mode.value === 'edit' ? (t('events.editEvent') || 'Edit Event') : (t('events.createEvent') || 'Create Event')))
const submitText = computed(() => props.submitLabel || (mode.value === 'edit' ? (t('events.updateEvent') || 'Update Event') : (t('events.createEvent') || 'Create Event')))

function onSubmit() {
  if (!localForm.name || !localForm.date) return
  emit('submit', { ...localForm })
}

function onCancel() {
  emit('update:modelValue', false)
  emit('cancel')
}

function normalizeDate(value: string) {
  // Ensure YYYY-MM-DD for input
  try {
    const d = new Date(value)
    if (!isNaN(d.getTime())) return d.toISOString().split('T')[0]
  } catch {}
  return value
}

function today() {
  return new Date().toISOString().split('T')[0]
}
</script>
