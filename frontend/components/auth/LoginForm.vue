<script setup lang="ts">
import { ref } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';

const route = useRoute();
const { signIn } = useAuth();
const config = useRuntimeConfig();

const loading = ref(false);
const authError = ref('');

const formSchema = toTypedSchema(
	z.object({
		identifier: z
			.string()
			.min(4, 'Email or Username must be at least 4 characters'),
		password: z.string().min(10, 'Password must be at least 10 characters'),
	}),
);

const form = useForm({
	validationSchema: formSchema,
	initialValues: {
		identifier: config.public.demoUser,
		password: config.public.demoPass,
	},
});

const onSubmit = form.handleSubmit(async (values) => {
	if (loading.value) return;

	loading.value = true;
	authError.value = '';

	try {
		// If there's a redirect query parameter, use it; otherwise, default to '/home'
		// Set addDefaultCallbackUrl: true in nuxt.config.ts to automatically add the current URL as the redirect parameter when accessing protected routes
		const targetUrl = (route.query.redirect as string) || '/home';

		await signIn(
			{
				identifier: values.identifier,
				password: values.password,
			},
			{ callbackUrl: targetUrl },
		);
	} catch (error: any) {
		console.error('Login error:', error);
		authError.value =
			error?.data?.error ||
			error?.data?.message ||
			error?.message ||
			'Login failed. Please check your credentials.';
	} finally {
		loading.value = false;
	}
});
</script>

<template>
	<form class="grid gap-2" @submit.prevent="onSubmit">
		<AuthFormCard
			title="Login to your account"
			description="Enter your credentials below to log in to your account"
			:error="authError"
			footer-text="Don't have an account?"
			footer-link-text="Register"
			footer-link-to="/register"
		>
			<template #fields>
				<FormField v-slot="{ componentField }" name="identifier">
					<FormItem>
						<FormLabel> Email or Username </FormLabel>
						<FormControl>
							<Input
								type="text"
								placeholder="Enter your Email or Username"
								autocomplete="identifier"
								:disabled="loading"
								v-bind="componentField"
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>

				<FormField v-slot="{ componentField }" name="password">
					<FormItem>
						<FormLabel>Password</FormLabel>
						<FormControl>
							<Input
								type="password"
								placeholder="Enter your password"
								autocomplete="current-password"
								:disabled="loading"
								v-bind="componentField"
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>
			</template>

			<template #actions>
				<Button
					type="submit"
					:disabled="loading"
					class="flex w-full items-center justify-center rounded-full"
				>
					<Icon
						v-if="loading"
						name="svg-spinners:8-dots-rotate"
						size="18"
						class="mr-2"
					/>
					{{ loading ? 'Logging in...' : 'Login' }}
				</Button>
			</template>
		</AuthFormCard>
	</form>
</template>