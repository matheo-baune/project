<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div class="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div class="text-center">
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ t('login.title') }}</h1>
                <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">{{ t('login.subtitle') }}</p>
            </div>

            <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
                <div class="rounded-md shadow-sm -space-y-px">
                    <div>
                        <label for="username" class="sr-only">{{ t('login.emailLabel') }}</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            autocomplete="username"
                            required
                            v-model="username"
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            :placeholder="t('login.emailLabel')"
                        />
                    </div>
                    <div>
                        <label for="password" class="sr-only">{{ t('login.passwordLabel') }}</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autocomplete="current-password"
                            required
                            v-model="password"
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            :placeholder="t('login.passwordLabel')"
                        />
                    </div>
                </div>

                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            v-model="rememberMe"
                            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                            {{ t('login.rememberMe') }}
                        </label>
                    </div>

                    <div class="text-sm">
                        <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">
                            {{ t('login.forgotPassword') }}
                        </a>
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        :disabled="loading"
                    >
            <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                   viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
                        <span v-else class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg"
                   viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clip-rule="evenodd"/>
              </svg>
            </span>
                        {{ t('login.signIn') }}
                    </button>
                </div>
            </form>

            <div class="mt-6">
                <div class="relative">
                    <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-gray-300"></div>
                    </div>
                    <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">
              {{ t('login.orContinueWith') }}
            </span>
                    </div>
                </div>

                <div class="mt-6 grid grid-cols-2 gap-3">
                    <div>
                        <a href="#" @click.prevent="handleRegister"
                           class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                            {{ t('login.register') }}
                        </a>
                    </div>
                    <div>
                        <a href="#" @click.prevent="handleDemoLogin"
                           class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                            {{ t('login.demoLogin') }}
                        </a>
                    </div>
                </div>
            </div>

            <div v-if="error" class="mt-4 text-center text-sm text-red-600">
                {{ error }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import {useUserStore} from '~/stores';
import {useI18n} from 'vue-i18n';

// Define reactive variables
const username = ref('');
const password = ref('');
const rememberMe = ref(false);
const loading = ref(false);
const error = ref('');

// Get router, user store, and i18n
const router = useRouter();
const userStore = useUserStore();
const {t} = useI18n();

// Handle login form submission
const handleLogin = async () => {
    loading.value = true;
    error.value = '';

    try {
        const success = await userStore.login(username.value, btoa(password.value), rememberMe.value);
        if (success) {
            await router.push('/dashboard');
        } else {
            error.value = t('login.invalidCredentials');
        }
    } catch (err) {
        error.value = t('login.loginError');
        console.error(err);
    } finally {
        loading.value = false;
    }
};

// Handle demo login
const handleDemoLogin = async () => {

    loading.value = true;
    error.value = '';

    try {
        const success = await userStore.login('matheo.baune@gmail.com', btoa('root'));

        if (success) {
            await router.push('/dashboard');
        } else {
            error.value = t('login.invalidCredentials');
        }
    } catch (err) {
        error.value = t('login.loginError');
        console.error(err);
    } finally {
        loading.value = false;
    }
};

// Handle registration
const handleRegister = async () => {
    loading.value = true;
    error.value = '';

    try {
        const success = await userStore.register('Test', username.value, btoa(password.value));
        if (success) {
            await router.push('/dashboard');
        } else {
            error.value = t('login.invalidCredentials');
        }
    } catch (err) {
        error.value = t('login.loginError');
        console.error(err);
    } finally {
        loading.value = false;
    }
};

// Redirect to dashboard if already logged in
onMounted(() => {
    if (userStore.isLoggedIn) {
        router.push('/dashboard');
    }
});
</script>
