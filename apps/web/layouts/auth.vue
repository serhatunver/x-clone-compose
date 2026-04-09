<template>
	<div class="min-h-screen bg-background">
		<div class="grid min-h-screen lg:grid-cols-2">
			<div
				class="relative hidden lg:flex flex-col justify-between overflow-hidden border-r bg-zinc-950 p-10 text-white"
			>
				<div
					class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_35%)]"
				/>

				<div class="relative z-10 flex items-center gap-3">
					<div
						class="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur"
					>
						<Icon name="ri:twitter-x-fill" size="28" />
					</div>
					<div>
						<p class="text-lg font-semibold">X Clone</p>
						<p class="text-sm text-zinc-400">Connect with the world</p>
					</div>
				</div>

				<div class="relative z-10 max-w-md">
					<h1 class="text-4xl font-bold leading-tight">
						See what’s happening in the world right now.
					</h1>
					<p class="mt-4 text-zinc-400">
						Join the conversation, share updates, and follow the people you care
						about.
					</p>
				</div>

				<div class="relative z-10 text-sm text-zinc-500">
					Built with Nuxt, Node.js, Express, and MongoDB.
				</div>
			</div>

			<div class="flex items-center justify-center p-6 sm:p-8 lg:p-12">
				<div class="w-full max-w-md">
					<slot />
				</div>
			</div>
		</div>
	</div>
</template>