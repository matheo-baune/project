<template>
  <BaseModal :is-open="isOpen" :title="title" @close="$emit('close')">
    <template #header>
      <div class="flex items-center gap-3">
        <div class="shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
          <Icon name="mdi:comment-text-outline" class="h-6 w-6 text-indigo-600" />
        </div>
        <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
          {{ title }}
        </h3>
      </div>
    </template>

    <div class="sm:text-left">
      <div v-if="loading" class="flex items-center justify-center py-8">
        <Icon name="line-md:loading-twotone-loop" class="animate-spin h-6 w-6 text-indigo-600" />
      </div>
      <div v-else class="space-y-4 max-h-80 overflow-y-auto pr-1">
        <div v-if="comments.length === 0" class="text-sm text-gray-500">No comments yet.</div>
        <div v-for="c in comments" :key="c.id" class="border border-gray-100 dark:border-gray-700 rounded-md p-3 bg-white dark:bg-gray-800">
          <div class="flex items-center justify-between">
            <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ c.authorName }}</div>
            <div class="text-xs text-gray-400">{{ formatDate(c.createdAt) }}</div>
          </div>
          <div class="mt-1 text-sm text-gray-700 dark:text-gray-200 whitespace-pre-line">{{ c.text }}</div>
        </div>
      </div>

      <div class="mt-4 space-y-2">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Add a comment</label>
        <input v-model="authorName" type="text" class="shadow-xs focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:text-black" placeholder="Your name (optional)" />
        <textarea v-model="text" rows="3" class="shadow-xs focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:text-black" placeholder="Write a comment..."></textarea>
        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      </div>
    </div>

    <template #footer>
      <UiButton variant="primary" :disabled="posting || !text.trim()" @click="postComment">
        <template #icon>
          <Icon v-if="posting" name="line-md:loading-twotone-loop" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
        </template>
        Post
      </UiButton>
      <UiButton class="sm:ml-3 sm:mt-0 mt-3" variant="secondary" @click="$emit('close')">Close</UiButton>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import BaseModal from '~/components/ui/BaseModal.vue'
import UiButton from '~/components/ui/UiButton.vue'

const props = defineProps<{ isOpen: boolean; giftId?: string; giftTitle?: string }>()
const emit = defineEmits<{ (e: 'close'): void; (e: 'posted'): void }>()

const loading = ref(false)
const posting = ref(false)
const error = ref('')

interface Comment {
  id: string
  authorName: string
  text: string
  createdAt: string
}

const comments = ref<Comment[]>([])
const authorName = ref('')
const text = ref('')
const title = computed(() => `Comments${props.giftTitle ? ' - ' + props.giftTitle : ''}`)

watch(() => props.isOpen, async (open) => {
  if (open && props.giftId) {
    await loadComments(props.giftId)
  }
})

async function loadComments(giftId: string) {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch(`/api/gifts/${giftId}/comments`)
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Failed to load comments')
    comments.value = data.map((r: any) => ({
      id: r.id?.toString?.() || String(r.id),
      authorName: r.authorName || 'Anonymous',
      text: r.text,
      createdAt: r.createdAt
    }))
  } catch (e: any) {
    console.error(e)
    error.value = e.message || 'Failed to load comments'
  } finally {
    loading.value = false
  }
}

async function postComment() {
  if (!props.giftId || !text.value.trim()) return
  posting.value = true
  error.value = ''
  try {
    const res = await fetch(`/api/gifts/${props.giftId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text.value.trim(), authorName: authorName.value.trim() || undefined })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Failed to post comment')
    // Push new
    comments.value.push({
      id: data.id?.toString?.() || String(data.id),
      authorName: data.authorName || 'Anonymous',
      text: data.text,
      createdAt: data.createdAt
    })
    text.value = ''
    emit('posted')
  } catch (e: any) {
    console.error(e)
    error.value = e.message || 'Failed to post comment'
  } finally {
    posting.value = false
  }
}

function formatDate(d: string) {
  try {
    const date = new Date(d)
    return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date)
  } catch {
    return d
  }
}
</script>
