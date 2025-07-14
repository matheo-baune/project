<template>
  <div>
    <Navbar />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <svg class="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-700">
              {{ error }}
            </p>
          </div>
        </div>
      </div>

      <!-- Group content -->
      <div v-else>
        <!-- Group header -->
        <div class="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
          <div class="flex items-center">
            <NuxtLink to="/dashboard" class="text-gray-400 hover:text-gray-600 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </NuxtLink>
            <h1 class="text-xl font-medium text-gray-900">{{ group?.name }}</h1>
            <span class="ml-2 text-xs text-gray-500">{{ group?.members.length }} members</span>
          </div>
          <button 
            @click="showCreateEventModal = true"
            class="text-xs text-indigo-600 hover:text-indigo-900"
          >
            + New Event
          </button>
        </div>

        <!-- Two-column layout -->
        <div class="flex flex-col md:flex-row gap-4">
          <!-- Members list (left column) -->
          <div class="w-full md:w-1/4 lg:w-1/5">
            <div class="bg-white shadow sm:rounded-lg sticky top-4">
              <div class="px-3 py-3 flex justify-between items-center border-b border-gray-200">
                <h3 class="text-sm font-medium text-gray-900">Members</h3>
                <button 
                  @click="showEditGroupModal = true"
                  class="text-indigo-600 hover:text-indigo-900"
                  title="Edit Members"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
              <ul class="divide-y divide-gray-100">
                <li v-for="member in group?.members" :key="member.id" class="px-3 py-2">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <div class="h-7 w-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-semibold text-xs">
                        {{ getMemberInitials(member) }}
                      </div>
                      <div class="ml-2 truncate">
                        <div class="text-xs font-medium text-gray-900">{{ member.firstname + ' ' + member.lastname }}</div>
                      </div>
                    </div>
                    <div v-if="member.id === group?.createdBy" class="text-xs text-indigo-600">
                      ★
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <!-- Events section (right column) -->
          <div class="w-full md:w-3/4 lg:w-4/5">
            <div class="flex justify-between items-center mb-3">
              <h2 class="text-lg font-medium text-gray-900">Events</h2>

              <!-- Display mode selector -->
              <div class="flex items-center space-x-2 bg-white rounded-lg shadow-sm p-1 border border-gray-100">
                <button 
                  @click="displayMode = 'small'"
                  class="p-1 rounded"
                  :class="displayMode === 'small' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'"
                  title="Small grid view"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button 
                  @click="displayMode = 'card'"
                  class="p-1 rounded"
                  :class="displayMode === 'card' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'"
                  title="Card view"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                  </svg>
                </button>
                <button 
                  @click="displayMode = 'large'"
                  class="p-1 rounded"
                  :class="displayMode === 'large' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'"
                  title="Large card view"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
                  </svg>
                </button>
                <button 
                  @click="displayMode = 'list'"
                  class="p-1 rounded"
                  :class="displayMode === 'list' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'"
                  title="List view"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>

          <!-- Empty state -->
          <div v-if="events.length === 0" class="bg-white border border-gray-100 rounded-lg p-4 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No events yet</h3>
            <button 
              @click="showCreateEventModal = true"
              class="mt-3 text-xs text-indigo-600 hover:text-indigo-900"
            >
              + Create Event
            </button>
          </div>

          <!-- Events grid or list based on display mode -->
          <div v-else 
            :class="{
              'grid gap-3': displayMode !== 'list',
              'grid-cols-1': true,
              'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4': displayMode === 'small',
              'sm:grid-cols-2 lg:grid-cols-3': displayMode === 'card',
              'sm:grid-cols-1 lg:grid-cols-2': displayMode === 'large',
              'flex flex-col space-y-2': displayMode === 'list'
            }"
          >
            <EventCard 
              v-for="event in events" 
              :key="event.id" 
              :event="event"
              :displayMode="displayMode"
              @delete="handleDeleteEvent"
            />
          </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Event Modal -->
    <div v-if="showCreateEventModal" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div 
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          aria-hidden="true"
          @click="closeModals"
        ></div>

        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Create New Event
                </h3>
                <div class="mt-4">
                  <form @submit.prevent="handleSubmitEvent">
                    <!-- Event Name -->
                    <div>
                      <label for="event-name" class="block text-sm font-medium text-gray-700">
                        Event Name *
                      </label>
                      <div class="mt-1">
                        <input 
                          type="text" 
                          name="event-name" 
                          id="event-name" 
                          v-model="eventForm.name"
                          required
                          class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" 
                          placeholder="Christmas, Birthday, Wedding..."
                        />
                      </div>
                    </div>

                    <!-- Event Date -->
                    <div class="mt-4">
                      <label for="event-date" class="block text-sm font-medium text-gray-700">
                        Event Date *
                      </label>
                      <div class="mt-1">
                        <input 
                          type="date" 
                          name="event-date" 
                          id="event-date" 
                          v-model="eventForm.date"
                          required
                          class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" 
                        />
                      </div>
                    </div>

                    <!-- Modal actions -->
                    <div class="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                      <button 
                        type="submit" 
                        :disabled="modalLoading || !eventForm.name || !eventForm.date"
                        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                        :class="{ 'opacity-50 cursor-not-allowed': modalLoading || !eventForm.name || !eventForm.date }"
                      >
                        <svg 
                          v-if="modalLoading" 
                          class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                          xmlns="http://www.w3.org/2000/svg" 
                          fill="none" 
                          viewBox="0 0 24 24"
                        >
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Create Event
                      </button>
                      <button 
                        type="button" 
                        @click="closeModals"
                        class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Group Modal -->
    <div v-if="showEditGroupModal" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div 
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          aria-hidden="true"
          @click="closeModals"
        ></div>

        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Edit Group
                </h3>
                <div class="mt-4">
                  <form @submit.prevent="handleSubmitGroup">
                    <!-- Group Name -->
                    <div>
                      <label for="group-name" class="block text-sm font-medium text-gray-700">
                        Group Name *
                      </label>
                      <div class="mt-1">
                        <input 
                          type="text" 
                          name="group-name" 
                          id="group-name" 
                          v-model="groupForm.name"
                          required
                          class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" 
                          placeholder="Family, Friends, Colleagues..."
                        />
                      </div>
                    </div>

                    <!-- Background Image -->
                    <div class="mt-4">
                      <label for="group-background" class="block text-sm font-medium text-gray-700">
                        Background Image URL
                      </label>
                      <div class="mt-1">
                        <input 
                          type="url" 
                          name="group-background" 
                          id="group-background" 
                          v-model="groupForm.background"
                          class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" 
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      <p class="mt-1 text-xs text-gray-500">
                        Optional: Add a URL to a background image for your group
                      </p>
                    </div>

                    <!-- Members -->
                    <div class="mt-4">
                      <label for="members" class="block text-sm font-medium text-gray-700">
                        Members
                      </label>
                      <div class="mt-1">
                        <div v-for="(member, index) in groupForm.members" :key="index" class="flex mb-2">
                          <input 
                            type="text" 
                            v-model="member.name"
                            placeholder="Name"
                            class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-1/2 sm:text-sm border-gray-300 rounded-l-md" 
                          />
                          <input 
                            type="email" 
                            v-model="member.email"
                            placeholder="Email"
                            class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-1/2 sm:text-sm border-gray-300 border-l-0 rounded-r-md" 
                          />
                          <button 
                            type="button" 
                            @click="removeMember(index)"
                            class="ml-2 inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            :disabled="member.id === group?.createdBy"
                            :class="{ 'opacity-50 cursor-not-allowed': member.id === group?.createdBy }"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <button 
                          type="button" 
                          @click="addMember"
                          class="mt-2 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                          </svg>
                          Add Member
                        </button>
                      </div>
                      <p class="mt-1 text-xs text-gray-500">
                        Add people who will be part of this group
                      </p>
                    </div>

                    <!-- Modal actions -->
                    <div class="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                      <button 
                        type="submit" 
                        :disabled="modalLoading || !groupForm.name"
                        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                        :class="{ 'opacity-50 cursor-not-allowed': modalLoading || !groupForm.name }"
                      >
                        <svg 
                          v-if="modalLoading" 
                          class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                          xmlns="http://www.w3.org/2000/svg" 
                          fill="none" 
                          viewBox="0 0 24 24"
                        >
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Update Group
                      </button>
                      <button 
                        type="button" 
                        @click="closeModals"
                        class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div 
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          aria-hidden="true"
          @click="showDeleteModal = false"
        ></div>

        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Delete Event
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Are you sure you want to delete this event? All gifts associated with this event will be permanently removed. This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              type="button" 
              @click="confirmDeleteEvent"
              :disabled="modalLoading"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              :class="{ 'opacity-50 cursor-not-allowed': modalLoading }"
            >
              <svg 
                v-if="modalLoading" 
                class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Delete
            </button>
            <button 
              type="button" 
              @click="showDeleteModal = false"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { Group, Event, User } from '~/types';
import { useUserStore, useGroupStore, useEventStore } from '~/stores';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const groupStore = useGroupStore();
const eventStore = useEventStore();

// Get the group ID from the route
const groupId = route.params.groupId as string;

// State
const loading = ref(true);
const error = ref('');
const group = ref<Group | null>(null);
const events = ref<Event[]>([]);
const displayMode = ref<'card' | 'list' | 'small' | 'large'>('card');

// Modal state
const showCreateEventModal = ref(false);
const showEditGroupModal = ref(false);
const showDeleteModal = ref(false);
const modalLoading = ref(false);
const currentEventId = ref('');

// Forms
const groupForm = ref({
  name: '',
  background: '',
  members: [] as User[]
});

const eventForm = ref({
  name: '',
  date: new Date().toISOString().split('T')[0], // Today's date as default
});

// Initialize the page
onMounted(async () => {
  // Check if user is logged in
  if (!userStore.isLoggedIn) {
    await router.push('/login');
    return;
  }

  await fetchGroup();
  await fetchEvents();
});

// Fetch group
const fetchGroup = async () => {
  loading.value = true;
  error.value = '';

  try {
    const fetchedGroup = await groupStore.fetchGroup(groupId);
    if (fetchedGroup) {
      group.value = fetchedGroup;

      // Initialize group form with current group data
      groupForm.value = {
        name: fetchedGroup.name,
        background: fetchedGroup.background || '',
        members: [...fetchedGroup.members]
      };
    } else {
      error.value = groupStore.error || 'Group not found';
    }
  } catch (err) {
    console.error('Failed to fetch group:', err);
    error.value = 'Failed to load group. Please try again.';
  } finally {
    loading.value = false;
  }
};

// Fetch events
const fetchEvents = async () => {
  if (!groupId) return;

  loading.value = true;
  error.value = '';

  try {
    const fetchedEvents = await eventStore.fetchEventsByGroupId(groupId);
    events.value = fetchedEvents;
  } catch (err) {
    console.error('Failed to fetch events:', err);
    error.value = 'Failed to load events. Please try again.';
  } finally {
    loading.value = false;
  }
};

// Get member initials for avatar
const getMemberInitials = (user: User) => {
    if (!user?.firstname) return '?';

    const firstNamePart = user.firstname.charAt(0).toUpperCase();
    const lastNamePart = user.lastname.charAt(0).toUpperCase();
    return firstNamePart + lastNamePart;
};

// Add a new member to the form
const addMember = () => {
  groupForm.value.members.push({
    id: Date.now().toString(), // Temporary ID
    name: '',
    email: ''
  });
};

// Remove a member from the form
const removeMember = (index: number) => {
  const member = groupForm.value.members[index];

  // Don't allow removing the creator
  if (member.id === group.value?.createdBy) {
    return;
  }

  groupForm.value.members.splice(index, 1);
};

// Handle group form submission
const handleSubmitGroup = async () => {
  if (!groupForm.value.name || !group.value) return;

  modalLoading.value = true;

  try {
    // Filter out empty members
    const validMembers = groupForm.value.members.filter(member => member.name && member.email);

    // Update group
    const updatedGroup = await groupStore.updateGroup(
      group.value.id,
      groupForm.value.name,
      validMembers,
      groupForm.value.background
    );

    if (updatedGroup) {
      group.value = updatedGroup;
      closeModals();
    } else {
      error.value = groupStore.error || 'Failed to update group';
    }
  } catch (err) {
    console.error('Failed to update group:', err);
    error.value = 'Failed to update group. Please try again.';
  } finally {
    modalLoading.value = false;
  }
};

// Handle event form submission
const handleSubmitEvent = async () => {
  if (!eventForm.value.name || !eventForm.value.date) return;

  modalLoading.value = true;

  try {
    // Create event
    const newEvent = await eventStore.createEvent(
      eventForm.value.name,
      eventForm.value.date,
      groupId
    );

    if (newEvent) {
      events.value.push(newEvent);
      closeModals();
    } else {
      error.value = eventStore.error || 'Failed to create event';
    }
  } catch (err) {
    console.error('Failed to create event:', err);
    error.value = 'Failed to create event. Please try again.';
  } finally {
    modalLoading.value = false;
  }
};

// Handle delete event
const handleDeleteEvent = (eventId: string) => {
  currentEventId.value = eventId;
  showDeleteModal.value = true;
};

// Confirm delete event
const confirmDeleteEvent = async () => {
  if (!currentEventId.value) return;

  modalLoading.value = true;

  try {
    const success = await eventStore.deleteEvent(currentEventId.value);

    if (success) {
      // Remove the event from the local state
      events.value = events.value.filter(event => event.id !== currentEventId.value);
      showDeleteModal.value = false;
    } else {
      error.value = eventStore.error || 'Failed to delete event';
    }
  } catch (err) {
    console.error('Failed to delete event:', err);
    error.value = 'Failed to delete event. Please try again.';
  } finally {
    modalLoading.value = false;
  }
};

// Close all modals and reset forms
const closeModals = () => {
  showCreateEventModal.value = false;
  showEditGroupModal.value = false;
  showDeleteModal.value = false;

  // Reset event form
  eventForm.value = {
    name: '',
    date: new Date().toISOString().split('T')[0],
  };

  // Reset group form to current group data
  if (group.value) {
    groupForm.value = {
      name: group.value.name,
      background: group.value.background || '',
      members: [...group.value.members]
    };
  }

  currentEventId.value = '';
};
</script>
