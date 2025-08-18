<template>
  <div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white shadow-sm overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Your Profile</h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">Personal details and avatar settings.</p>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <svg class="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="bg-red-50 border-l-4 border-red-400 p-4 mb-6 mx-4">
          <div class="flex">
            <div class="shrink-0">
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

        <!-- Profile content -->
        <div v-else class="border-t border-gray-200">
          <dl>
            <!-- Avatar section -->
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Avatar</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div class="flex items-center">
                  <div class="shrink-0 h-20 w-20 rounded-full overflow-hidden bg-gray-100">
                    <img v-if="user?.avatar" :src="user.avatar" alt="User avatar" class="h-full w-full object-cover" />
                    <div v-else class="h-full w-full flex items-center justify-center bg-indigo-100 text-indigo-800 text-xl font-semibold">
                      {{ getUserInitials() }}
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="flex space-x-2">
                      <button 
                        @click="showAvatarModal = true"
                        class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-xs text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Change Avatar
                      </button>
                    </div>
                    <p class="mt-1 text-xs text-gray-500">
                      Choose an avatar to represent you in groups
                    </p>
                  </div>
                </div>
              </dd>
            </div>

            <!-- Name section -->
            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Full name</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ user?.firstname }} {{user?.lastname}}</dd>
            </div>


            <!-- Email section -->
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Email address</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ user?.email }}</dd>
            </div>

              <!-- Username section -->
              <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">Username</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ user?.username }}</dd>
              </div>

              <!-- Date de création -->
              <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">Compte créé le </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ new Date(user?.createdAt as string).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric'  })
                      }}</dd>
              </div>
          </dl>
        </div>
      </div>
    </div>

    <!-- Avatar Selection Modal -->
    <BaseModal
      :model-value="showAvatarModal"
      @update:modelValue="val => showAvatarModal = val"
      :title="t('profile.selectAvatar') || 'Select Avatar'"
    >
      <div class="sm:text-left w-full">
        <div class="mt-1">
          <div class="grid grid-cols-4 gap-4">
            <div
              v-for="(avatar, index) in defaultAvatars"
              :key="index"
              @click="selectAvatar(avatar)"
              class="cursor-pointer rounded-lg p-2 hover:bg-gray-100"
              :class="{ 'ring-2 ring-indigo-500 bg-indigo-50': selectedAvatar === avatar }"
            >
              <img :src="avatar" alt="Avatar option" class="h-16 w-16 rounded-full object-cover mx-auto" />
            </div>
          </div>

          <!-- Custom avatar URL input -->
          <div class="mt-4">
            <label for="custom-avatar" class="block text-sm font-medium text-gray-700">
              {{ t('profile.orEnterCustomAvatar') || 'Or enter a custom avatar URL' }}
            </label>
            <div class="mt-1 flex rounded-md shadow-xs">
              <input
                type="text"
                name="custom-avatar"
                id="custom-avatar"
                v-model="customAvatarUrl"
                class="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
            <div v-if="customAvatarUrl" class="mt-2">
              <p class="text-sm font-medium text-gray-700 mb-1">Profil Avatar Preview:</p>
              <div class="w-full flex justify-center">
                <img :src="customAvatarUrl" alt="Background preview"
                     class="h-[200px] w-[200px] object-cover border border-gray-200"
                     style="border-radius: 100%; border: 4px dimgrey solid" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <UiButton variant="primary" :disabled="modalLoading" @click="saveAvatar">
          <template #icon>
            <svg v-if="modalLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </template>
          {{ t('common.save') }}
        </UiButton>
        <UiButton class="sm:ml-3 sm:mt-0 mt-3" variant="secondary" @click="showAvatarModal = false">
          {{ t('common.cancel') }}
        </UiButton>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '~/stores';
import { useI18n } from 'vue-i18n'
import BaseModal from '~/components/ui/BaseModal.vue'
import UiButton from '~/components/ui/UiButton.vue'

const userStore = useUserStore();
const { t } = useI18n()

// State
const loading = ref(true);
const error = ref('');
const showAvatarModal = ref(false);
const modalLoading = ref(false);
const selectedAvatar = ref('');
const customAvatarUrl = ref('');

// Default avatar options
const defaultAvatars = [
  'https://ui-avatars.com/api/?name=User&background=6366F1&color=fff',
  'https://ui-avatars.com/api/?name=User&background=EF4444&color=fff',
  'https://ui-avatars.com/api/?name=User&background=10B981&color=fff',
  'https://ui-avatars.com/api/?name=User&background=F59E0B&color=fff',
  'https://ui-avatars.com/api/?name=User&background=3B82F6&color=fff',
  'https://ui-avatars.com/api/?name=User&background=8B5CF6&color=fff',
  'https://ui-avatars.com/api/?name=User&background=EC4899&color=fff',
  'https://ui-avatars.com/api/?name=User&background=14B8A6&color=fff',
];

// Get current user
const user = computed(() => userStore.currentUser);

// Initialize the profile page
onMounted(() => {
  loading.value = false;
});

// Get user initials for avatar placeholder
const getUserInitials = () => {
    console.log('user.value:', user.value);

    return 'sas';
};

// Select an avatar from the options
const selectAvatar = (avatar: string) => {
  selectedAvatar.value = avatar;
  customAvatarUrl.value = '';
};

// Save the selected avatar
const saveAvatar = async () => {
  modalLoading.value = true;
  error.value = '';

  try {
    const avatarUrl = customAvatarUrl.value || selectedAvatar.value;

    if (!avatarUrl) {
      error.value = 'Please select an avatar or enter a custom URL';
      modalLoading.value = false;
      return;
    }

    const success = await userStore.updateAvatar(avatarUrl);

    if (success) {
      showAvatarModal.value = false;
    } else {
      error.value = userStore.error || 'Failed to update avatar';
    }
  } catch (err) {
    console.error('Failed to update avatar:', err);
    error.value = 'Failed to update avatar. Please try again.';
  } finally {
    modalLoading.value = false;
  }
};
</script>
