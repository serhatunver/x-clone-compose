<script setup lang="ts">
definePageMeta({
	layout: 'auth',
	auth: {
		unauthenticatedOnly: true,
		navigateAuthenticatedTo: '/home',
	},
});
</script>

<template>
	<AuthPage
		title="Create an account"
		description="Enter your details below to create your account"
	>
		<RegisterForm />
	</AuthPage>
</template>