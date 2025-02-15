<script setup lang="ts">
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

const formSchema = toTypedSchema(
	z.object({
		username: z.string().min(4),
		password: z.string().min(6),
	})
);

const form = useForm({
	validationSchema: formSchema,
});

const { signIn } = useAuth();

const loading = ref(false);

const onSubmit = form.handleSubmit(async (values) => {
	loading.value = true;
	try {
		const res = await signIn(
			{
				username: values.username,
				password: values.password,
			},
			{ callbackUrl: "/home" }
		);
	} catch (error) {
		console.error(error);
	} finally {
		loading.value = false;
	}
});
</script>

<template>
	<div>
		<form class="grid gap-2" @submit="onSubmit">
			<Card>
				<CardHeader class="space-y-1">
					<CardTitle class="text-2xl">
						Login to your account
					</CardTitle>
					<CardDescription>
						Enter your credentials below to login to your account
					</CardDescription>
				</CardHeader>
				<CardContent class="grid gap-4">
					<FormField v-slot="{ componentField }" name="username">
						<FormItem>
							<FormLabel>Username</FormLabel>
							<FormControl>
								<Input
									type="text"
									placeholder="username"
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
									placeholder=""
									v-bind="componentField"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					</FormField>
				</CardContent>
				<CardFooter class="flex flex-col gap-2">
					<Button
						type="submit"
						:disabled="loading"
						class="flex items-center justify-center w-full rounded-full mb-2"
					>
						<Icon
							v-if="loading"
							name="svg-spinners:8-dots-rotate"
							size="18"
						/>
						{{ loading ? "Loading" : "Login" }}
					</Button>
					<Separator class="my-2" label="Or" />
					<div>Don't have an account?</div>
					<NuxtLink class="w-full rounded-full" to="/register">
						<Button class="w-full rounded-full"> Register </Button>
					</NuxtLink>
				</CardFooter>
			</Card>
		</form>
	</div>
</template>

<!-- // components/LoginForm.vue
<template>
	<form @submit.prevent="handleSubmit" class="max-w-md mx-auto">
		<div class="mb-4">
			<label class="block mb-2">Email</label>
			<input
				v-model="username"
				type="username"
				required
				class="w-full px-3 py-2 border rounded"
			/>
		</div>

		<div class="mb-4">
			<label class="block mb-2">Password</label>
			<input
				v-model="password"
				type="password"
				required
				class="w-full px-3 py-2 border rounded"
			/>
		</div>

		<button
			type="submit"
			class="w-full px-4 py-2 bg-blue-500 text-white rounded"
			:disabled="loading"
		>
			{{ loading ? "Loading..." : "Login" }}
		</button>

		<p v-if="error" class="mt-4 text-red-500">
			{{ error }}
		</p>
	</form>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
const router = useRouter();

const username = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

async function handleSubmit() {
	loading.value = true;
	error.value = "";

	try {
		const success = await authStore.login(username.value, password.value);
		if (success) {
			router.push("/home");
		} else {
			error.value = "Invalid credentials";
		}
	} catch (e) {
		error.value = "An error occurred";
	} finally {
		loading.value = false;
	}
}
</script> -->