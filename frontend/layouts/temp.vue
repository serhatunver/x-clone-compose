<script setup lang=ts>
const route = useRoute();
const { data, signOut } = useAuth();

import { ref } from "vue";

const navData = {
	user: {
		name: "shadcn",
		email: "m@example.com",
		avatar: "/avatars/shadcn.jpg",
	},
	navMain: [
		{
			title: "Home",
			url: "/home",
			icon: "material-symbols:home-outline-rounded",
			activeIcon: "material-symbols:home-rounded",
			isActive: true,
		},
		{
			title: "Notifications",
			url: "/notifications",
			icon: "si:notifications-alt-line",
			activeIcon: "si:notifications-alt-fill",
		},
		{
			title: "Explore",
			url: "/explore",
			icon: "heroicons:magnifying-glass-solid",
			activeIcon: "heroicons:magnifying-glass-20-solid",
		},
		{
			title: "Messages",
			url: "/messages",
			icon: "heroicons:envelope",
			activeIcon: "heroicons:envelope-16-solid",
		},
		{
			title: "Bookmarks",
			url: "/bookmarks",
			icon: "si:bookmark-line",
			activeIcon: "si:bookmark-fill",
		},
		{
			title: "Communities",
			url: "/communities",
			icon: "bi:people",
			activeIcon: "bi:people-fill",
		},
		{
			title: "Premium",
			url: "/premium",
			icon: "line-md:twitter-x",
			activeIcon: "line-md:twitter-x",
		},
		{
			title: "Verified Orgs",
			url: "/verified-orgs",
			icon: "si:verified-line",
			activeIcon: "si:verified-fill",
		},
		{
			title: "Profile",
			url: `/${data.value?.username}`,
			icon: "material-symbols:person-outline",
			activeIcon: "material-symbols:person-rounded",
		},
		{
			title: "More",
			url: "/more",
			icon: "si:more-horiz-circle-line",
			activeIcon: "si:more-horiz-circle-fill",
		},
	],
};
</script>

<template>
	<SidebarProvider>
		<Sidebar collapsible="icon">
			<SidebarHeader
				class="flex flex-row items-center justify-between p-4"
			>
				<SidebarMenu>
					<SidebarMenuItem
						class="flex size-8 items-center justify-center rounded-full"
					>
						<Icon name="line-md:twitter-x" size="36" />
					</SidebarMenuItem>
				</SidebarMenu>
				<SidebarTrigger />
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarMenu>
						<NuxtLink
							v-for="item in navData.navMain"
							:key="item.title"
							class="rounded-full hover:bg-muted py-1"
							:to="item.url"
						>
							<SidebarMenuItem class="">
								<SidebarMenuButton
									class=""
									:tooltip="item.title"
								>
									<div
										class="flex items-center justify-center"
									>
										<Icon
											class="flex"
											:name="
												(route.path === `${item.url}` &&
													item.activeIcon) ||
												item.icon
											"
											size="24"
										/>
									</div>
									<span class="text-base">
										{{ item.title }}
									</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</NuxtLink>
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger as-child>
								<SidebarMenuButton
									size="lg"
									class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
								>
									<Avatar class="h-8 w-8 rounded-lg">
										<AvatarImage
											:src="data?.profileImg"
											:alt="navData.user.name"
										/>
										<AvatarFallback class="rounded-lg">
											CN
										</AvatarFallback>
									</Avatar>
									<div
										class="grid flex-1 text-left text-sm leading-tight"
									>
										<span class="truncate font-semibold">
											{{ data?.username }}
										</span>
										<span class="truncate text-xs">{{
											navData.user.email
										}}</span>
									</div>
									<Icon
										name="lucide:chevrons-up-down"
										size="16"
									/>
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								class="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
								side="bottom"
								align="end"
								:side-offset="4"
							>
								<!-- <DropdownMenuLabel class="p-0 font-normal">
									<div
										class="flex items-center gap-2 px-1 py-1.5 text-left text-sm"
									>
										<Avatar class="h-8 w-8 rounded-lg">
											<AvatarImage
												:src="navData.user.avatar"
												:alt="navData.user.name"
											/>
											<AvatarFallback class="rounded-lg">
												CN
											</AvatarFallback>
										</Avatar>
										<div
											class="grid flex-1 text-left text-sm leading-tight"
										>
											<span
												class="truncate font-semibold"
											>
												{{ data?.username }}
											</span>
											<span class="truncate text-xs">
												{{ navData.user.email }}
											</span>
										</div>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator /> -->
								<DropdownMenuItem
									class="px-4 py-3 hover:cursor-pointer"
								>
									<Icon
										class="flex"
										name="lucide:settings-2"
										size="16"
									/>
									Add an existing account
								</DropdownMenuItem>
								<DropdownMenuItem
									@click="
										async () =>
											await signOut({
												callbackUrl: '/login',
											})
									"
									class="px-4 py-3 hover:cursor-pointer"
								>
									<Icon
										class="flex"
										name="lucide:log-out"
										size="16"
									/>
									<span>
										Log out
										<b> @{{ data?.username }} </b>
									</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
		<SidebarInset>
			<!-- <header
				class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
			>
				<div class="flex items-center gap-2 px-4">
					<SidebarTrigger class="-ml-1" />
					<Separator orientation="vertical" class="mr-2 h-4" />
				</div>
			</header> -->
			<div>
				<!-- <SidebarTrigger class="mt-4" /> -->
				<slot />
			</div>
		</SidebarInset>
	</SidebarProvider>
</template>