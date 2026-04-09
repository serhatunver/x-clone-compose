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
		title="Welcome back"
		description="Log in to continue to your account"
	>
		<LoginForm />
	</AuthPage>
</template>