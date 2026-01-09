<script setup lang="ts">
definePageMeta({
  layout: 'none',
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/home',
  },
});
import { cn } from '@/lib/utils';
</script>

<template>
  <div>
    <div
      class="container relative h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0"
    >
      <div
        class="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex"
      >
        <div class="absolute inset-0 bg-zinc-900" />
        <div class="relative z-20 flex items-center text-lg font-medium">
          <Icon name="ri:twitter-x-fill" size="48" />
        </div>
      </div>
      <div class="lg:p-8">
        <div
          class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]"
        >
          <RegisterForm />
          <p class="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our
            <a
              href="/terms"
              class="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </a>
            and
            <a
              href="/privacy"
              class="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
