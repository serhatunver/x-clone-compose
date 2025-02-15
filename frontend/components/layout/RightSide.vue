<script lang="ts" setup>
</script>

<template>
	<div
		class="hidden lg:flex lg:flex-col w-[290px] min-[1084px]:w-[350px] mr-[10px] min-[1384px]:mr-[70px]"
	>
		<div
			class="w-full max-w-sm items-center mb-3 pt-[5px] sticky top-0 bg-white z-10"
		>
			<Input
				id="search"
				type="text"
				placeholder="Search"
				class="flex justify-center h-11 items-center pl-14 bg-muted rounded-full w-full focus-visible:ring-0 focus-visible:ring-offset-0"
			/>
			<span
				class="absolute start-2 inset-y-0 flex items-center justify-center px-2"
			>
				<Icon name="ri:search-line" class="text-slate-500" size="20" />
			</span>
		</div>
		<Card
			class="p-4 mb-4 rounded-2xl flex flex-col justify-between gap-[10px]"
		>
			<CardHeader class="p-0">
				<CardTitle class="font-bold text-xl">
					Subscribe to Premium
				</CardTitle>
				<CardDescription class="p-0">
					Subsccribe to unlock new features and if eligible, receive a
					share of revenue.
				</CardDescription>
			</CardHeader>
			<CardFooter class="p-0">
				<Button class="rounded-full bg-sky-600">Subscribe</Button>
			</CardFooter>
		</Card>
		<Card class="rounded-2xl mb-4">
			<CardHeader class="px-4 py-3">
				<CardTitle class="font-bold text-xl"> Who to follow </CardTitle>
			</CardHeader>
			<CardContent class="p-0">
				<div
					v-for="i in 3"
					:key="i"
					class="flex justify-between items-center w-full px-4 py-3 hover:cursor-pointer hover:bg-muted"
				>
					<div class="flex">
						<img
							class="w-10 h-10"
							src="https://pbs.twimg.com/profile_images/1638090920951250944/QEPY4cpL_400x400.jpg"
							alt=""
						/>
					</div>
					<div class="flex justify-between w-full">
						<div class="flex flex-col flex-1 text-left mx-3">
							<div class="flex justify-start items-center gap-1">
								<div class="font-bold">Real Madrid C.F.</div>
								<Icon
									name="material-symbols:verified"
									size="20"
									class="text-amber-500"
								/>
							</div>
							<div class="font-sm">@realmadrid</div>
						</div>
						<div class="flex justify-center items-center ml-3">
							<Button class="rounded-full">Follow</Button>
						</div>
					</div>
				</div>
			</CardContent>
			<CardFooter class="p-0">
				<a
					href="#"
					class="flex text-sky-500 px-4 py-3 hover:bg-muted hover:cursor-pointer w-full"
					variant="ghost"
				>
					Show more
				</a>
			</CardFooter>
		</Card>
		<Card class="rounded-2xl">
			<CardHeader class="px-4 py-3">
				<CardTitle class="font-bold text-xl">
					What’s happening
				</CardTitle>
			</CardHeader>
			<CardContent class="p-0">
				<div
					v-for="i in 4"
					:key="i"
					class="flex flex-col justify-between w-full px-4 py-3 hover:cursor-pointer hover:bg-muted relative"
				>
					<div class="flex text-xs">Trending in Poland</div>
					<div class="flex font-semibold mt-0.5">Trend {{ i }}</div>
					<div class="flex absolute top-3 right-6">
						<Icon name="ri:more-fill" size="20" />
					</div>
				</div>
			</CardContent>
			<CardFooter class="p-0">
				<a
					href="#"
					class="flex text-sky-500 px-4 py-3 hover:bg-muted hover:cursor-pointer w-full"
					variant="ghost"
				>
					Show more
				</a>
			</CardFooter>
		</Card>
	</div>
</template>

<style scoped>
</style>