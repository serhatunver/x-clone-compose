<script setup lang="ts">
interface Props {
	title: string;
	description: string;
	error?: string;
	footerText: string;
	footerLinkText: string;
	footerLinkTo: string;
	footerSeparatorLabel?: string;
}

withDefaults(defineProps<Props>(), {
	error: '',
	footerSeparatorLabel: 'OR',
});
</script>

<template>
	<Card class="border-border/60 shadow-lg">
		<CardHeader class="space-y-1">
			<CardTitle class="text-2xl">{{ title }}</CardTitle>
			<CardDescription>
				{{ description }}
			</CardDescription>
		</CardHeader>

		<CardContent class="grid gap-4">
			<div
				v-if="error"
				class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600"
			>
				{{ error }}
			</div>

			<slot name="fields" />
		</CardContent>

		<CardFooter class="flex flex-col gap-3">
			<slot name="actions" />

			<div class="flex items-center w-full gap-3 text-xs text-muted-foreground">
				<div class="h-px flex-1 bg-border" />
				<span>{{ footerSeparatorLabel }}</span>
				<div class="h-px flex-1 bg-border" />
			</div>

			<p class="text-sm text-muted-foreground">
				{{ footerText }}
			</p>

			<NuxtLink class="w-full" :to="footerLinkTo">
				<Button class="w-full rounded-full" variant="outline">
					{{ footerLinkText }}
				</Button>
			</NuxtLink>
		</CardFooter>
	</Card>
</template>