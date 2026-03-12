<script setup lang="ts">
interface Props {
	title: string;
	description: string;
}

defineProps<Props>();
</script>

<template>
	<div class="space-y-6">
		<div class="flex items-center justify-center lg:hidden">
			<div
				class="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-950 text-white shadow"
			>
				<Icon name="ri:twitter-x-fill" size="30" />
			</div>
		</div>

		<div class="space-y-2 text-center lg:text-left">
			<h2 class="text-3xl font-bold tracking-tight">{{ title }}</h2>
			<p class="text-sm text-muted-foreground">
				{{ description }}
			</p>
		</div>

		<slot />
	</div>
</template>