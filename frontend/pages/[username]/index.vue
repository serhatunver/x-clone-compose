<script setup lang="ts">
import { computed, watch } from 'vue';

const route = useRoute();
const { data } = useAuth();

const profileStore = useProfileStore();
const postsStore = usePostsStore();

const username = computed(() => String(route.params.username || ''));

const profile = computed(() => profileStore.profile);
const isLoading = computed(() => profileStore.loading || postsStore.loading);
const error = computed(() => profileStore.error || postsStore.error);

const formattedCreatedAt = computed(() => {
	if (!profile.value?.createdAt) return '';

	return new Date(profile.value.createdAt).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
	});
});

watch(
	() => username.value,
	async (newUsername) => {
		if (!newUsername) return;

		try {
			await Promise.all([
				profileStore.fetchProfile(newUsername),
				postsStore.fetchUserPosts(newUsername),
			]);
		} catch (error) {
			console.error(error);
		}
	},
	{ immediate: true },
);
</script>

<template>
	<div class="flex lg:w-[920px] min-[1084px]:w-[990px] min-[1384px]:w-[1050px]">
		<div
			v-if="isLoading"
			class="flex w-full min-h-screen justify-center items-center mx-auto"
		>
			<Icon name="svg-spinners:90-ring" size="32" class="text-blue-500" />
		</div>

		<div v-else-if="error" class="p-4">
			{{ error }}
		</div>

		<div v-else-if="!profile" class="p-4">User not found.</div>

		<main
			v-else
			class="flex lg:w-[920px] min-[1084px]:w-[990px] min-[1384px]:w-[1050px] justify-between"
		>
			<div class="flex flex-col w-full min-[684px]:w-[600px] border-x-[1px]">
				<HeaderNav :totalPosts="profile.totalPosts ?? 0" />

				<div class="w-full h-[200px] bg-muted">
					<img
						v-if="profile.coverImg"
						:src="profile.coverImg"
						:alt="`${profile.username}'s cover image`"
						class="w-full h-full object-cover object-center"
					/>
				</div>

				<div class="flex flex-col gap-4 px-4 py-3">
					<div class="flex justify-between items-center">
						<div>
							<img
								class="w-36 h-36 rounded-full ring ring-accent-foreground -mt-20 relative object-cover object-center"
								:src="profile.profileImg || '/default-avatar.png'"
								:alt="profile.username"
							/>
						</div>

						<Button
							v-if="profile.username !== data?.username"
							class="rounded-full bg-sky-600"
						>
							Follow
						</Button>
					</div>

					<div>
						<div class="font-bold">
							{{ profile.username }}
						</div>
						<div>@{{ profile._id }}</div>
					</div>

					<div class="flex items-center gap-1">
						<Icon name="material-symbols:calendar-month" size="20" />
						Joined on {{ formattedCreatedAt }}
					</div>

					<div class="flex gap-4">
						<div>
							<b>{{ profile.following?.length ?? 0 }}</b>
							following
						</div>
						<div>
							<b>{{ profile.followers?.length ?? 0 }}</b>
							followers
						</div>
					</div>
				</div>

				<Tabs default-value="posts" class="w-full">
					<TabsList
						class="flex h-[52px] rounded-none bg-white p-0 border-b-[1px]"
					>
						<TabsTrigger
							class="flex-1 h-full rounded-none hover:bg-muted data-[state=active]:shadow-none data-[active=true]:border-b-2 data-[active=false]:border-white data-[active=true]:border-sky-500 text-md"
							value="posts"
						>
							Posts
						</TabsTrigger>
						<TabsTrigger
							class="flex-1 h-full rounded-none hover:bg-muted data-[state=active]:shadow-none data-[active=true]:border-b-2 data-[active=false]:border-white data-[active=true]:border-sky-500 text-md"
							value="replies"
						>
							Replies
						</TabsTrigger>
					</TabsList>

					<TabsContent value="posts" class="mt-0">
						<ScrollArea class="flex" style="--scrollbar-size: 0px !important">
							<div class="flex flex-col w-full">
								<TransitionGroup name="list" appear>
									<Post
										v-for="post in postsStore.userPosts"
										:key="post._id"
										:post="post"
									/>
								</TransitionGroup>
							</div>
						</ScrollArea>
					</TabsContent>

					<TabsContent value="replies" class="mt-0">
						<div class="p-4 text-muted-foreground">No replies yet.</div>
					</TabsContent>
				</Tabs>
			</div>

			<RightSide />
		</main>
	</div>
</template>