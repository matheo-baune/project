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
                    <Icon name="heroicons-outline:calendar" class="h-6 w-6 text-indigo-600"/>
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
                        {{ t('events.eventName')}} *
                    </label>
                    <div class="mt-1">
                        <input
                            type="text"
                            name="event-name"
                            id="event-name"
                            v-model="localForm.name"
                            required
                            class="shadow-xs focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:text-white"
                            :placeholder="t('events.eventNamePlaceholder')"
                        />
                    </div>
                </div>

                <!-- Event Date -->
                <div>
                    <label for="event-date" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        {{ t('events.eventDate') }} *
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

                <!-- Concerned person and participants -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        {{ t('events.targetPerson')}}
                    </label>
                    <div class="mt-2">
                        <div class="mt-2 flex items-center gap-2">
                            <input id="all-targets" type="checkbox" v-model="allTargets" />
                            <label for="all-targets" class="text-xs text-gray-600 dark:text-gray-300 cursor-pointer">
                                {{ t('events.allMembersAreTargets')}}
                            </label>
                        </div>
                        <USelectMenu
                            v-model="targetSelected"
                            :items="membersCombobox"
                            multiple
                            class="w-full"
                            :teleport="false"
                            :disabled="allTargets"
                            :hidden="allTargets"
                            :popper="{ strategy: 'fixed', placement: 'bottom-start' }"
                        />
                    </div>

                    <div class="mt-4 relative z-[60]">
                        <div class="flex items-center justify-between mb-2">
                            <label class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ t('events.selectParticipants') }}</label>
                            <label class="text-xs inline-flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" v-model="selectAll" @change="toggleSelectAll">
                                {{ t('common.selectAll')}}
                            </label>
                        </div>
                        <USelectMenu
                            name="selectParticipant"
                            id="selectParticipant"
                            v-model="participantsSelected"
                            multiple
                            searchable
                            :items="membersComboboxWithDisabled"
                            class="w-full"
                            :teleport="false"
                            :popper="{ strategy: 'fixed', placement: 'bottom-start' }"
                        />
                        <p v-if="participantsSelected.length" class="mt-1 text-xs text-gray-500">
                            {{ participantsSelected.length }} {{ t('common.selected')}}
                        </p>
                    </div>
                </div>

                <!-- Background URL (optional) -->
                <div>
                    <label for="event-background" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        {{ t('events.eventBackground') }}
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
                        {{ t('events.eventBackgroundHelp') }}
                    </p>
                    <div v-if="localForm.background" class="mt-2">
                        <p class="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">{{
                                t('common.preview')
                            }}</p>
                        <img :src="localForm.background" alt="Background preview"
                             class="h-32 w-full object-cover border border-gray-200 rounded-md"/>
                    </div>
                </div>
            </form>
        </div>

        <template #footer>
            <UiButton form="event-form" type="submit" variant="primary"
                      :disabled="loading || !localForm.name || !localForm.date">
                <template #icon>
                    <Icon v-if="loading" name="line-md:loading-twotone-loop"
                          class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"/>
                </template>
                {{ submitText }}
            </UiButton>
            <UiButton class="sm:ml-3 sm:mt-0 mt-3" variant="secondary" type="button" @click="onCancel">
                {{ t('common.cancel') }}
            </UiButton>
        </template>
    </BaseModal>
</template>

<script setup lang="ts">
import type { SelectMenuItem } from '@nuxt/ui'
import {computed, reactive, watch, ref} from 'vue'
import {useI18n} from 'vue-i18n'
import BaseModal from '~/components/ui/BaseModal.vue'
import UiButton from '~/components/ui/UiButton.vue'

interface EventLike {
    id?: string
    name: string
    date: string
    background?: string
    targetPersonId?: string
}

interface MemberLike {
    id: string;
    firstname: string;
    lastname: string;
    avatar?: string;
    email?: string;
}

const props = defineProps<{
    modelValue: boolean
    mode?: 'create' | 'edit'
    initialEvent?: EventLike
    loading?: boolean
    title?: string
    submitLabel?: string
    members: MemberLike[]
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'submit', payload: EventLike): void
    (e: 'cancel'): void
}>()

const { t } = useI18n()

const mode = computed(() => props.mode ?? 'create')
const loading = computed(() => props.loading)

const membersCombobox = computed<SelectMenuItem[]>(() => (props.members || []).map((member) => ({
    label: member.firstname + ' ' + member.lastname,
    value: member.id,
    avatar: {
        src: member.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(`${member.firstname} ${member.lastname}`)}&background=6366F1&color=fff`,
        alt: member.firstname + ' ' + member.lastname
    }
})));

const localForm = reactive<EventLike>({
    id: props.initialEvent?.id,
    name: props.initialEvent?.name || '',
    date: props.initialEvent?.date ? normalizeDate(props.initialEvent.date) : today(),

    background: props.initialEvent?.background || '',
    targetPersonId: props.initialEvent?.targetPersonId
})

// Target and participants selection state (front-end only for now)
const targetSelected = ref<SelectMenuItem | null>(null)
const participantsSelected = ref<SelectMenuItem[]>([])
const selectAll = ref(false)
const allTargets = ref(false)

const membersComboboxWithDisabled = computed<SelectMenuItem[]>(() =>
    membersCombobox.value.map(item => ({
        ...item,
        disabled: localForm.targetPersonId === item.value
    }))
)

watch(allTargets, (val) => {
    if (val) {
        // Everyone is a target: no single target person
        targetSelected.value = null
        localForm.targetPersonId = undefined
    }
})

const allMembersItems = computed(() => membersCombobox.value)
function toggleSelectAll() {
    if (selectAll.value) {
        participantsSelected.value = [...allMembersItems.value]
    } else {
        // Keep the concerned person if selected
        participantsSelected.value = targetSelected.value ? [targetSelected.value] : []
    }
}

function ensureTargetInParticipants() {
    if (targetSelected.value) {
        const id = targetSelected.value.value
        if (!participantsSelected.value.find(i => i.value === id)) {
            participantsSelected.value = [...participantsSelected.value, targetSelected.value]
        }
    }
}

watch(() => props.modelValue, (open) => {
    if (open) {
        localForm.id = props.initialEvent?.id
        localForm.name = props.initialEvent?.name || ''
        localForm.date = props.initialEvent?.date ? normalizeDate(props.initialEvent.date) : today()
        localForm.background = props.initialEvent?.background || ''
        localForm.targetPersonId = props.initialEvent?.targetPersonId
        // reset selections on open
        selectAll.value = false
        // derive allTargets from initial form data
        allTargets.value = !localForm.targetPersonId
        // set targetSelected from form
        targetSelected.value = membersCombobox.value.find(i => i.value === localForm.targetPersonId) || null
        // initialize participants keeping target if any
        participantsSelected.value = targetSelected.value ? [targetSelected.value] : []
    }
})

watch(() => props.initialEvent, (val) => {
    if (props.modelValue) {
        localForm.id = val?.id
        localForm.name = val?.name || ''
        localForm.date = val?.date ? normalizeDate(val.date) : today()
        localForm.background = val?.background || ''
        localForm.targetPersonId = val?.targetPersonId
        // sync allTargets and target selection
        allTargets.value = !localForm.targetPersonId
        targetSelected.value = membersCombobox.value.find(i => i.value === localForm.targetPersonId) || null
        // make sure target is included in participants
        ensureTargetInParticipants()
    }
}, {deep: true})

const modalTitle = computed(() => props.title || (mode.value === 'edit' ? (t('events.editEvent') || 'Edit Event') : (t('events.createEvent') || 'Create Event')))
const submitText = computed(() => props.submitLabel || (mode.value === 'edit' ? (t('events.updateEvent') || 'Update Event') : (t('events.createEvent') || 'Create Event')))

// Keep localForm.targetPersonId in sync with targetSelected
watch(targetSelected, (item) => {
    localForm.targetPersonId = item ? String(item.value) : undefined
    ensureTargetInParticipants()
})

// Prevent removing the target from participants
watch(participantsSelected, () => {
    ensureTargetInParticipants()
})

function onSubmit() {
    if (!localForm.name || !localForm.date) return
    emit('submit', {...localForm})
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
    } catch {
    }
    return value
}

function today() {
    return new Date().toISOString().split('T')[0]
}
</script>
