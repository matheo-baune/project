<template>
  <div class="event-card overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer" @click="openEvent">
    <div class="relative p-4 bg-cover bg-center" :style="backgroundStyle">
      <div class="text-white" style="text-shadow: 0 1px 3px rgba(0,0,0,0.6);">
        <h3 class="text-lg font-bold mb-1">{{ event.name }}</h3>
        <div class="flex items-center mb-2">
          <NuxtIcon name="heroicons-outline:calendar" class="h-4 w-4 mr-1" />
          <p class="text-sm text-white text-opacity-90">{{ formattedDate }}</p>
        </div>
        <div class="mb-2">
          <div v-if="targetMembers.length" class="mt-1 flex -space-x-2">
            <div v-for="m in targetMembers" :key="m.id" class="inline-block h-6 w-6 rounded-full ring-2 ring-white overflow-hidden" :title="m.firstname + ' ' + m.lastname">
              <img v-if="m.avatar" :src="m.avatar" :alt="m.firstname + ' ' + m.lastname" class="h-full w-full object-cover" />
              <div v-else class="h-full w-full bg-white/80 text-indigo-700 flex items-center justify-center text-xs font-semibold">
                {{ getInitials(m.firstname, m.lastname) }}
              </div>
            </div>
          </div>
        </div>
        <div v-if="isUpcoming" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white bg-opacity-30" style="text-shadow: 0 1px 2px rgba(0,0,0,0.5);">
          <span class="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
          Upcoming
        </div>
        <div v-else-if="isPast" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white bg-opacity-30" style="text-shadow: 0 1px 2px rgba(0,0,0,0.5);">
          <span class="w-2 h-2 bg-gray-400 rounded-full mr-1"></span>
          Past
        </div>
      </div>
    </div>
    <div class="bg-white p-3">
      <table class="w-full text-sm">
        <caption class="sr-only">Event Actions</caption>
        <thead>
          <tr>
            <th scope="col" class="sr-only">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="py-2">
              <div class="flex justify-between">
                <button @click.stop="$emit('edit', event)" class="flex items-center text-gray-500 hover:text-gray-700">
                  <NuxtIcon name="heroicons-outline:pencil-square" class="h-4 w-4 mr-1" />
                  Edit
                </button>
                <button @click.stop="$emit('delete', event.id)" class="flex items-center text-red-500 hover:text-red-700">
                  <NuxtIcon name="heroicons-outline:trash" class="h-4 w-4 mr-1" />
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Event, User } from '~/types'

const props = defineProps<{ event: Event }>()
const emit = defineEmits<(e: 'delete', id: string) => void>()

const formattedDate = computed(() => {
  const date = new Date(props.event.date)
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(date)
})

const isUpcoming = computed(() => {
  const eventDate = new Date(props.event.date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return eventDate >= today
})

const isPast = computed(() => {
  const eventDate = new Date(props.event.date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return eventDate < today
})

const targetMembers = computed(() => {
  const members = (props.event as any)?.members as (User & { isTarget?: boolean })[] | undefined
  return (members || []).filter(m => m.isTarget)
})

function getInitials(firstname?: string, lastname?: string) {
  const f = (firstname || '').trim()
  const l = (lastname || '').trim()
  return `${f.charAt(0)}${l.charAt(0)}`.toUpperCase() || '?'
}

const backgroundImages = {
  birthday: 'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  christmas: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  wedding: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  default: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
}

const backgroundStyle = computed(() => {
  const eventNameLower = props.event.name.toLowerCase()
  let backgroundImage = backgroundImages.default
  if (eventNameLower.includes('birthday')) backgroundImage = backgroundImages.birthday
  else if (eventNameLower.includes('christmas')) backgroundImage = backgroundImages.christmas
  else if (eventNameLower.includes('wedding')) backgroundImage = backgroundImages.wedding
  if (props.event.background) backgroundImage = props.event.background
  return { backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${backgroundImage})` }
})

const router = useRouter()
const openEvent = () => {
  router.push(`/events/${props.event.id}`)
}
</script>
