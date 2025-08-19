<template>
  <div class="event-card-large overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer" @click="openEvent">
    <div class="relative p-6 bg-cover bg-center" :style="backgroundStyle">
      <div class="absolute top-4 right-4 bg-white bg-opacity-20 p-2 rounded-full">
        <Icon name="heroicons-outline:calendar" class="h-6 w-6 text-white" />
      </div>

      <div class="text-white" style="text-shadow: 0 1px 3px rgba(0,0,0,0.6);">
        <h3 class="text-xl font-bold mb-2">{{ event.name }}</h3>
        <div class="flex items-center mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p class="text-base text-white text-opacity-90">{{ formattedDate }}</p>
        </div>
        <div v-if="targetMembers.length" class="mb-3 flex -space-x-2">
          <div v-for="m in targetMembers" :key="m.id" class="inline-block h-7 w-7 rounded-full ring-2 ring-white overflow-hidden" :title="m.firstname + ' ' + m.lastname">
            <img v-if="m.avatar" :src="m.avatar" :alt="m.firstname + ' ' + m.lastname" class="h-full w-full object-cover" />
            <div v-else class="h-full w-full bg-white/80 text-indigo-700 flex items-center justify-center text-xs font-semibold">
              {{ getInitials(m.firstname, m.lastname) }}
            </div>
          </div>
        </div>
        <div v-if="isUpcoming" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-30" style="text-shadow: 0 1px 2px rgba(0,0,0,0.5);">
          <span class="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
          Upcoming
        </div>
        <div v-else-if="isPast" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-30" style="text-shadow: 0 1px 2px rgba(0,0,0,0.5);">
          <span class="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
          Past
        </div>
      </div>
    </div>

    <div class="bg-white p-4">
      <div class="flex justify-between items-center mb-3">
        <NuxtLink :to="`/events/${event.id}`" class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700" @click.stop>
          <Icon name="mdi:gift" class="h-4 w-4 mr-1" />
          View Gifts
        </NuxtLink>
        <div class="flex space-x-2">
          <NuxtLink :to="`/events/${event.id}/edit`" class="inline-flex items-center px-2 py-1 border border-gray-300 shadow-xs text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50" @click.stop>
            <Icon name="heroicons-outline:pencil-square" class="h-4 w-4 mr-1" />
            Edit
          </NuxtLink>
          <button @click.stop="$emit('delete', event.id)" class="inline-flex items-center px-2 py-1 border border-gray-300 shadow-xs text-xs font-medium rounded-sm text-red-700 bg-white hover:bg-red-50">
            <Icon name="heroicons-outline:trash" class="h-4 w-4 mr-1" />
            Delete
          </button>
        </div>
      </div>
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
