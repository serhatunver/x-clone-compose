<script setup lang="ts">
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const route = useRoute();

interface Item {
	title: string;
	href: string;
	icon: string;
	activeIcon: string;
	variant: any;
}

const bottomNavItems: Item[] = [
	{
		title: "Home",
		href: "/home",
		icon: "material-symbols:home-outline-rounded",
		activeIcon: "material-symbols:home-rounded",
		variant: "ghost",
	},
	{
		title: "Explore",
		href: "/explore",
		icon: "heroicons:magnifying-glass-solid",
		activeIcon: "heroicons:magnifying-glass-20-solid",
		variant: "ghost",
	},
	{
		title: "Notifications",
		href: "/notifications",
		icon: "si:notifications-alt-line",
		activeIcon: "si:notifications-alt-fill",
		variant: "ghost",
	},
	{
		title: "Messages",
		href: "/messages",
		icon: "heroicons:envelope",
		activeIcon: "heroicons:envelope-16-solid",
		variant: "ghost",
	},
	{
		title: "Bookmarks",
		href: "/bookmarks",
		icon: "si:bookmark-line",
		activeIcon: "si:bookmark-fill",
		variant: "ghost",
	},
	{
		title: "Communities",
		href: "/communities",
		icon: "bi:people",
		activeIcon: "bi:people-fill",
		variant: "ghost",
	},
];
</script>

<template>
	<!-- <div class="flex w-full h-full justify-between items-center"> -->
	<nav
		class="fixed bottom-0 left-0 right-0 z-50 flex justify-between items-center bg-white w-full shadow-lg"
	>
		<a
			v-for="(link, index) of bottomNavItems"
			:key="index"
			:href="link.href"
			class="flex flex-col items-center justify-center w-full h-full py-3"
			:class="
				cn(
					buttonVariants({
						variant: link.variant,
						size: 'sm',
					}),
					'',
					route.path === `${link.href}` && 'font-bold'
				)
			"
		>
			<Icon
				:name="
					(route.path === `${link.href}` && link.activeIcon) ||
					link.icon
				"
				class="flex"
				size="26"
			/>
			<span class="hidden xl:flex text-xl ml-5 mr-4"
				>{{ link.title }}
			</span>
		</a>
	</nav>
	<!-- </div> -->
</template>