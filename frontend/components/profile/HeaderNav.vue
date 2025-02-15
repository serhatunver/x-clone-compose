<script lang="ts" setup>
defineProps({
	totalPosts: Number,
	content: String,
});
</script>

<template>
	<div
		class="flex gap-4 justify-start items-center w-full p-4 h-14 sticky top-0 bg-white z-10"
	>
		<Button
			@click="$router.back()"
			variant="ghost"
			size="icon"
			class="rounded-full"
		>
			<Icon name="material-symbols:arrow-back-rounded" size="24" />
		</Button>
		<div class="flex flex-col items-center justify-center">
			<div class="font-bold text-lg">
				<span v-if="!content">
					{{ $route.params.username }}
				</span>
				<span v-else>
					{{ content }}
				</span>
			</div>
			<div v-if="totalPosts" class="font-light text-sm">
				{{ totalPosts }} posts
			</div>
		</div>
	</div>
</template>

<style scoped>
</style>