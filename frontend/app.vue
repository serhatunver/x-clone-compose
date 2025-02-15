<script setup lang="ts">
import Toaster from "@/components/ui/toast/Toaster.vue";
</script>

<template>
	<div>
		<NuxtLoadingIndicator />
		<NuxtLayout>
			<NuxtPage />
			<NuxtRouteAnnouncer />
			<Toaster />
		</NuxtLayout>
	</div>
</template>

<style>
</style>