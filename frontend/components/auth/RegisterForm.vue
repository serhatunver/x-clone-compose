<script setup lang="ts">
import { ref } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';

const { signUp } = useAuth();

const loading = ref(false);
const authError = ref('');

const formSchema = toTypedSchema(
	z.object({
		username: z.string().min(4, 'Username must be at least 4 characters'),
		email: z.string().email('Please enter a valid email address'),
		password: z.string().min(6, 'Password must be at least 6 characters'),
	}),
);

const form = useForm({
	validationSchema: formSchema,
	initialValues: {
		username: '',
		email: '',
		password: '',
	},
});

const onSubmit = form.handleSubmit(async (values) => {
	if (loading.value) return;

	loading.value = true;
	authError.value = '';

	try {
		await signUp(
			{
				username: values.username,
				email: values.email,
				password: values.password,
			},
			{
				callbackUrl: '/home',
				redirect: true,
			},
		);
	} catch (error: any) {
		console.error('Register error:', error);
		authError.value =
			error?.data?.error ||
			error?.data?.message ||
			error?.message ||
			'Registration failed. Please try again.';
	} finally {
		loading.value = false;
	}
});
</script>

<template>
	<form class="grid gap-2" @submit.prevent="onSubmit">
		<AuthFormCard
			title="Create an account"
			description="Enter your details below to create your account"
			:error="authError"
			footer-text="Already have an account?"
			footer-link-text="Login"
			footer-link-to="/login"
		>
			<template #fields>
				<FormField v-slot="{ componentField }" name="username">
					<FormItem>
						<FormLabel>Username</FormLabel>
						<FormControl>
							<Input
								type="text"
								placeholder="Enter your username"
								autocomplete="username"
								:disabled="loading"
								v-bind="componentField"
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>

				<FormField v-slot="{ componentField }" name="email">
					<FormItem>
						<FormLabel>Email</FormLabel>
						<FormControl>
							<Input
								type="email"
								placeholder="Enter your email"
								autocomplete="email"
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
								autocomplete="new-password"
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
					{{ loading ? 'Creating account...' : 'Create account' }}
				</Button>
			</template>
		</AuthFormCard>
	</form>
</template>