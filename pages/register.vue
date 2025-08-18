<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div class="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div class="text-center">
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ t('register.title', 'Create an account') }}</h1>
                <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">{{ t('register.subtitle', 'Register to start using our application') }}</p>
            </div>

            <!-- Validation errors -->
            <div v-if="formErrors.length > 0" class="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                <div class="flex">
                    <div class="shrink-0">
                        <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                        </svg>
                    </div>
                    <div class="ml-3">
                        <h3 class="text-sm font-medium text-red-800">{{ t('validation.pleaseCorrect') }}</h3>
                        <ul class="mt-1 text-sm text-red-700 list-disc list-inside">
                            <li v-for="(error, index) in formErrors" :key="index">{{ error }}</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Required fields legend -->
            <div class="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {{ t('validation.requiredFields') }}
            </div>

            <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
                <div class="rounded-md shadow-xs space-y-3">
                    <!-- First Name -->
                    <div>
                        <label for="firstname" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {{ t('register.firstnameLabel', 'First Name') }} <span class="text-red-500">*</span>
                        </label>
                        <input
                            id="firstname"
                            name="firstname"
                            type="text"
                            required
                            v-model="firstname"
                            :class="[
                                'appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-hidden focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm',
                                formErrors.some(e => e.includes(t('register.firstNameRequired')))
                                    ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                                    : 'border-gray-300'
                            ]"
                            :placeholder="t('register.firstnamePlaceholder', 'Enter your first name')"
                        />
                        <p v-if="formErrors.some(e => e.includes(t('register.firstNameRequired')))" class="mt-1 text-sm text-red-600">
                            {{ t('register.firstNameRequired') }}
                        </p>
                    </div>

                    <!-- Last Name -->
                    <div>
                        <label for="lastname" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {{ t('register.lastnameLabel', 'Last Name') }} <span class="text-red-500">*</span>
                        </label>
                        <input
                            id="lastname"
                            name="lastname"
                            type="text"
                            required
                            v-model="lastname"
                            :class="[
                                'appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-hidden focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm',
                                formErrors.some(e => e.includes(t('register.lastNameRequired')))
                                    ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                                    : 'border-gray-300'
                            ]"
                            :placeholder="t('register.lastnamePlaceholder', 'Enter your last name')"
                        />
                        <p v-if="formErrors.some(e => e.includes(t('register.lastNameRequired')))" class="mt-1 text-sm text-red-600">
                            {{ t('register.lastNameRequired') }}
                        </p>
                    </div>

                    <!-- Username -->
                    <div>
                        <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {{ t('register.usernameLabel', 'Username') }} <span class="text-red-500">*</span>
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            v-model="username"
                            :class="[
                                'appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-hidden focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm',
                                formErrors.some(e => e.includes('username'))
                                    ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                                    : 'border-gray-300'
                            ]"
                            :placeholder="t('register.usernamePlaceholder', 'Choose a username')"
                        />
                        <p v-if="formErrors.some(e => e.includes('username'))" class="mt-1 text-sm text-red-600">
                            {{ t('validation.requiredField') }}
                        </p>
                    </div>

                    <!-- Email -->
                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {{ t('register.emailLabel', 'Email') }} <span class="text-red-500">*</span>
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autocomplete="email"
                            required
                            v-model="email"
                            :class="[
                                'appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-hidden focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm',
                                formErrors.some(e => e.includes(t('register.emailRequired')))
                                    ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                                    : 'border-gray-300'
                            ]"
                            :placeholder="t('register.emailPlaceholder', 'Enter your email')"
                        />
                        <p v-if="formErrors.some(e => e.includes(t('register.emailRequired')))" class="mt-1 text-sm text-red-600">
                            {{ t('register.emailRequired') }}
                        </p>
                    </div>

                    <!-- Password -->
                    <div>
                        <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {{ t('register.passwordLabel', 'Password') }} <span class="text-red-500">*</span>
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autocomplete="new-password"
                            required
                            v-model="password"
                            :class="[
                                'appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-hidden focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm',
                                formErrors.some(e => e.includes(t('register.passwordRequired')))
                                    ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                                    : 'border-gray-300'
                            ]"
                            :placeholder="t('register.passwordPlaceholder', 'Create a password')"
                        />
                        <p v-if="formErrors.some(e => e.includes(t('register.passwordRequired')))" class="mt-1 text-sm text-red-600">
                            {{ t('register.passwordRequired') }}
                        </p>
                    </div>

                    <!-- Confirm Password -->
                    <div>
                        <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {{ t('register.confirmPasswordLabel', 'Confirm Password') }} <span class="text-red-500">*</span>
                        </label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            autocomplete="new-password"
                            required
                            v-model="confirmPassword"
                            :class="[
                                'appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-hidden focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm',
                                formErrors.some(e => e.includes(t('register.confirmPasswordRequired'))) || formErrors.some(e => e.includes(t('register.passwordMismatch')))
                                    ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                                    : 'border-gray-300'
                            ]"
                            :placeholder="t('register.confirmPasswordPlaceholder', 'Confirm your password')"
                        />
                        <p v-if="formErrors.some(e => e.includes(t('register.confirmPasswordRequired')))" class="mt-1 text-sm text-red-600">
                            {{ t('register.confirmPasswordRequired') }}
                        </p>
                        <p v-if="formErrors.some(e => e.includes(t('register.passwordMismatch')))" class="mt-1 text-sm text-red-600">
                            {{ t('register.passwordMismatch') }}
                        </p>
                    </div>
                </div>

                <!-- Avatar (Optional) -->
                <div>
                    <label for="avatar" class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ t('register.avatarLabel', 'Avatar URL (Optional)') }}</label>
                    <input
                        id="avatar"
                        name="avatar"
                        type="text"
                        v-model="avatar"
                        class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-hidden focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        :placeholder="t('register.avatarPlaceholder', 'Enter avatar URL (optional)')"
                    />
                </div>

                <div>
                    <button
                        type="submit"
                        class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        :disabled="loading || !isFormValid"
                    >
                        <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
                            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </span>
                        <span v-else class="absolute left-0 inset-y-0 flex items-center pl-3">
                            <svg class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
                            </svg>
                        </span>
                        {{ t('register.signUp', 'Sign up') }}
                    </button>
                </div>
            </form>

            <div class="mt-6 text-center">
                <p class="text-sm text-gray-600 dark:text-gray-300">
                    {{ t('register.alreadyHaveAccount', 'Already have an account?') }}
                    <NuxtLink to="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
                        {{ t('register.signIn', 'Sign in') }}
                    </NuxtLink>
                </p>
            </div>

            <div v-if="error" class="mt-4 text-center text-sm text-red-600">
                {{ error }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// Use minimal auth layout (no Navbar/Footer)
definePageMeta({ layout: 'auth' })
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '~/stores';
import { useI18n } from 'vue-i18n';

// Define reactive variables
const firstname = ref('');
const lastname = ref('');
const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const avatar = ref('');
const loading = ref(false);
const error = ref('');
const formErrors = ref<string[]>([]);

// Watch for changes in form fields to clear specific errors
watch(() => firstname.value, (newValue) => {
    if (newValue) {
        formErrors.value = formErrors.value.filter(error => 
            !error.includes(t('register.firstNameRequired')));
    }
});

watch(() => lastname.value, (newValue) => {
    if (newValue) {
        formErrors.value = formErrors.value.filter(error => 
            !error.includes(t('register.lastNameRequired')));
    }
});

watch(() => username.value, (newValue) => {
    if (newValue) {
        formErrors.value = formErrors.value.filter(error => 
            !error.includes('username'));
    }
});

watch(() => email.value, (newValue) => {
    if (newValue) {
        formErrors.value = formErrors.value.filter(error => 
            !error.includes(t('register.emailRequired')));
    }
});

watch(() => password.value, (newValue) => {
    if (newValue) {
        formErrors.value = formErrors.value.filter(error => 
            !error.includes(t('register.passwordRequired')));
    }
    if (newValue && confirmPassword.value && newValue === confirmPassword.value) {
        formErrors.value = formErrors.value.filter(error => 
            !error.includes(t('register.passwordMismatch')));
    }
});

watch(() => confirmPassword.value, (newValue) => {
    if (newValue) {
        formErrors.value = formErrors.value.filter(error => 
            !error.includes(t('register.confirmPasswordRequired')));
    }
    if (newValue && password.value && newValue === password.value) {
        formErrors.value = formErrors.value.filter(error => 
            !error.includes(t('register.passwordMismatch')));
    }
});

// Get router, user store, and i18n
const router = useRouter();
const userStore = useUserStore();
const { t } = useI18n();

// Computed property to check if form is valid
const isFormValid = computed(() => {
    return (
        firstname.value.trim() !== '' &&
        lastname.value.trim() !== '' &&
        username.value.trim() !== '' &&
        email.value.trim() !== '' &&
        password.value.trim() !== '' &&
        confirmPassword.value.trim() !== '' &&
        password.value === confirmPassword.value
    );
});

// Handle registration form submission
const handleRegister = async () => {
    // Reset error and formErrors
    error.value = '';
    formErrors.value = [];

    // Validate required fields
    if (!firstname.value.trim()) {
        formErrors.value.push(t('register.firstNameRequired'));
    }

    if (!lastname.value.trim()) {
        formErrors.value.push(t('register.lastNameRequired'));
    }

    if (!username.value.trim()) {
        formErrors.value.push(t('validation.requiredField') + ' (username)');
    }

    if (!email.value.trim()) {
        formErrors.value.push(t('register.emailRequired'));
    }

    if (!password.value) {
        formErrors.value.push(t('register.passwordRequired'));
    }

    if (!confirmPassword.value) {
        formErrors.value.push(t('register.confirmPasswordRequired'));
    }

    // Validate passwords match
    if (password.value && confirmPassword.value && password.value !== confirmPassword.value) {
        formErrors.value.push(t('register.passwordMismatch'));
    }

    // If there are validation errors, don't proceed
    if (formErrors.value.length > 0) {
        return;
    }

    loading.value = true;

    try {
        // Use the user store's register method
        const success = await userStore.register(
            firstname.value,
            lastname.value,
            username.value,
            email.value,
            btoa(password.value), // Encode password
            avatar.value || undefined
        );

        if (!success) {
            error.value = userStore.error || t('register.registrationFailed', 'Registration failed');
            return;
        }

        // Redirect to dashboard
        await router.push('/dashboard');
    } catch (err) {
        console.error('Registration error:', err);
        error.value = t('register.registrationError', 'An error occurred during registration');
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
