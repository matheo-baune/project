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
                    <NuxtIcon name="heroicons-outline:calendar" class="h-6 w-6 text-indigo-600"/>
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
                            v-model="targetsSelected"
                            multiple
                            :items="membersCombobox"
                            class="w-full"
                            :teleport="false"
                            :disabled="allTargets"
                            :hidden="allTargets"
                            :popper="{ strategy: 'fixed', placement: 'bottom-start' }"
                        />
                    </div>

                    <div class="mt-4">
                        <label class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ t('events.selectParticipants') }}</label>
                        <USelectMenu
                            v-model="participantToAdd"
                            :items="availableMembersToAdd"
                            searchable
                            class="w-full mt-2"
                            :teleport="false"
                            :popper="{ strategy: 'fixed', placement: 'bottom-start' }"
                            :disabled="allTargets"
                            placeholder="Rechercher un membre..."
                        />
                        <ul class="mt-3 space-y-2 max-h-60 overflow-auto pr-1">
                            <li
                                v-for="item in participantsSelected"
                                :key="item.value"
                                class="flex items-center justify-between bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 rounded-md px-2 py-1"
                            >
                                <div class="flex items-center gap-2">
                                    <img v-if="item.avatar?.src" :src="item.avatar.src" :alt="item.avatar?.alt || item.label" class="h-6 w-6 rounded-full object-cover"/>
                                    <div v-else class="h-6 w-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-semibold">
                                        {{ item.label?.[0] }}
                                    </div>
                                    <span class="text-sm">{{ item.label }}</span>
                                    <span
                                        v-if="isTarget(item.value)"
                                        class="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                                    >
                                        {{ t('events.targetPerson') }}
                                    </span>
                                </div>
                                <button
                                    class="text-red-600 hover:text-red-800 disabled:text-gray-400"
                                    :disabled="allTargets || isTarget(item.value)"
                                    @click.prevent="removeParticipant(item.value)"
                                    title="Remove"
                                >
                                    <NuxtIcon name="heroicons-outline:x-mark" class="h-5 w-5"/>
                                </button>
                            </li>
                        </ul>
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
                    <NuxtIcon v-if="loading" name="line-md:loading-twotone-loop"
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

interface EventMemberEntry {
    id: string
    isTarget: boolean
}

interface EventLike {
    id?: string
    name: string
    date: string
    background?: string
    members?: EventMemberEntry[]
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
    members: Array.isArray(props.initialEvent?.members)
        ? [...(props.initialEvent?.members as EventMemberEntry[])]
        : [],
})

// Target and participants selection state (front-end only for now)
const targetsSelected = ref<SelectMenuItem[]>([])
const participantsSelected = ref<SelectMenuItem[]>([])
const participantToAdd = ref<SelectMenuItem | null>(null)
const allTargets = ref(false)

const availableMembersToAdd = computed<SelectMenuItem[]>(() =>
    membersCombobox.value.filter(item => !participantsSelected.value.some(p => p.value === item.value))
)

watch(allTargets, (val) => {
    if (val) {
        // Everyone is a target: ignore individual targets
        targetsSelected.value = []
        // targets list controlled by targetsSelected/allTargets; members built on submit
        // Everyone participates and cannot be edited via the list
        participantsSelected.value = [...membersCombobox.value]
    } else {
        // When disabling allTargets, ensure all selected targets are in participants
        ensureTargetsInParticipants()
    }
})

function addParticipant(item: SelectMenuItem) {
    if (!participantsSelected.value.find(i => i.value === item.value)) {
        participantsSelected.value = [...participantsSelected.value, item]
    }
}

function isTarget(id: string | number) {
    const sid = String(id)
    if (allTargets.value) return true
    return Array.isArray(targetsSelected.value) && targetsSelected.value.some(i => String(i.value) === sid)
}

function removeParticipant(id: string | number) {
    if (allTargets.value) return
    if (isTarget(id)) return
    participantsSelected.value = participantsSelected.value.filter(i => String(i.value) !== String(id))
    ensureTargetsInParticipants()
}

function ensureTargetsInParticipants() {
    if (!targetsSelected.value?.length) return
    const currentIds = new Set(participantsSelected.value.map(i => String(i.value)))
    const toAdd = targetsSelected.value.filter(t => !currentIds.has(String(t.value)))
    if (toAdd.length) {
        participantsSelected.value = [...participantsSelected.value, ...toAdd]
    }
}

watch(() => props.modelValue, (open) => {
    if (open) {
        localForm.id = props.initialEvent?.id
        localForm.name = props.initialEvent?.name || ''
        localForm.date = props.initialEvent?.date ? normalizeDate(props.initialEvent.date) : today()
        localForm.background = props.initialEvent?.background || ''
        localForm.members = Array.isArray(props.initialEvent?.members)
            ? [...(props.initialEvent?.members as EventMemberEntry[])]
            : []
        // do not auto-toggle allTargets; default to off unless user checks it
        allTargets.value = false
        // set targetsSelected from members marked as target
        const targetIds = new Set((localForm.members || []).filter(m => m.isTarget).map(m => String(m.id)))
        targetsSelected.value = membersCombobox.value.filter(i => targetIds.has(String(i.value)))
        // initialize participants based on mode: start from any members in the list if provided, else from targets
        const existingParticipantIds = new Set((localForm.members || []).map(m => String(m.id)))
        if (allTargets.value) {
            participantsSelected.value = [...membersCombobox.value]
        } else if (existingParticipantIds.size) {
            participantsSelected.value = membersCombobox.value.filter(i => existingParticipantIds.has(String(i.value)))
            ensureTargetsInParticipants()
        } else {
            participantsSelected.value = [...targetsSelected.value]
        }
    }
})

watch(() => props.initialEvent, (val) => {
    if (props.modelValue) {
        localForm.id = val?.id
        localForm.name = val?.name || ''
        localForm.date = val?.date ? normalizeDate(val.date) : today()
        localForm.background = val?.background || ''
        localForm.members = Array.isArray(val?.members)
            ? [...(val?.members as EventMemberEntry[])]
            : []
        // keep allTargets as-is; set targetsSelected based on members marked as target
        const targetIds = new Set((localForm.members || []).filter(m => m.isTarget).map(m => String(m.id)))
        targetsSelected.value = membersCombobox.value.filter(i => targetIds.has(String(i.value)))
        // sync participants
        if (allTargets.value) {
            participantsSelected.value = [...membersCombobox.value]
        } else {
            // Prefer members list provided; otherwise ensure targets are included
            const existingParticipantIds = new Set((localForm.members || []).map(m => String(m.id)))
            if (existingParticipantIds.size) {
                participantsSelected.value = membersCombobox.value.filter(i => existingParticipantIds.has(String(i.value)))
            }
            ensureTargetsInParticipants()
        }
    }
}, {deep: true})

const modalTitle = computed(() => props.title || (mode.value === 'edit' ? (t('events.editEvent') || 'Edit Event') : (t('events.createEvent') || 'Create Event')))
const submitText = computed(() => props.submitLabel || (mode.value === 'edit' ? (t('events.updateEvent') || 'Update Event') : (t('events.createEvent') || 'Create Event')))

// Keep UI in sync when targets change
watch(targetsSelected, () => {
    ensureTargetsInParticipants()
})

// Add participant from autocomplete then clear it
watch(participantToAdd, (item) => {
    if (item) {
        addParticipant(item)
        participantToAdd.value = null
    }
})

// Prevent removing the target from participants and lock when allTargets
watch(participantsSelected, (newVal) => {
    if (allTargets.value) {
        const desired = membersCombobox.value
        const isSame = newVal.length === desired.length && newVal.every((item, idx) => String(item.value) === String(desired[idx].value))
        if (!isSame) {
            participantsSelected.value = [...desired]
        }
        return
    }
    ensureTargetsInParticipants()
})

function onSubmit() {
    if (!localForm.name || !localForm.date) return
    // Build members array: list of participants with isTarget flag
    let members: EventMemberEntry[]
    if (allTargets.value) {
        members = (props.members || []).map(m => ({ id: String(m.id), isTarget: true }))
    } else {
        const targetIdSet = new Set(targetsSelected.value.map(i => String(i.value)))
        const participantIdSet = new Set(participantsSelected.value.map(i => String(i.value)))
        members = Array.from(participantIdSet).map(id => ({ id, isTarget: targetIdSet.has(id) }))
    }
    const payload: EventLike = {
        id: localForm.id,
        name: localForm.name,
        date: localForm.date,
        background: localForm.background,
        members
    }
    emit('submit', payload)
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
