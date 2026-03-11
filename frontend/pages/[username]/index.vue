<script lang="ts" setup>
import { ref, computed, watch } from 'vue';

const userStore = useUserStore();
const postsStore = usePostsStore();
const { data } = useAuth();
const route = useRoute();

const loading = ref(false);
const error = ref('');

interface Post {
	_id: string;
}

interface UserRef {
	_id: string;
	username: string;
}

interface User {
	_id: string;
	username: string;
	createdAt: string;
	posts: Post[];
	following: UserRef[];
	followers: UserRef[];
	totalPosts: number;
	coverImg?: string;
	profileImg?: string;
}

const username = computed(() => String(route.params.username || ''));
const user = computed<User | null>(() => userStore.user);

const formattedCreatedAt = computed(() => {
	if (!user.value?.createdAt) return '';
	const date = new Date(user.value.createdAt);
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
	});
});

watch(
	() => username.value,
	async (newUsername) => {
		if (!newUsername) return;

		loading.value = true;
		error.value = '';

		try {
			await Promise.all([
				userStore.fetchUser(newUsername),
				postsStore.fetchUserPosts(newUsername),
			]);
		} catch (err) {
			console.error(err);
			error.value = 'Failed to load profile.';
		} finally {
			loading.value = false;
		}
	},
	{ immediate: true },
);
</script>

<template>
	<div class="flex lg:w-[920px] min-[1084px]:w-[990px] min-[1384px]:w-[1050px]">
		<div
			v-if="loading"
			class="flex w-full min-h-screen justify-center items-center mx-auto"
		>
			<Icon name="svg-spinners:90-ring" size="32" class="text-blue-500" />
		</div>

		<div v-else-if="error" class="p-4">
			{{ error }}
		</div>

		<div v-else-if="!user" class="p-4">User not found.</div>

		<main
			v-else
			class="flex lg:w-[920px] min-[1084px]:w-[990px] min-[1384px]:w-[1050px] justify-between"
		>
			<div class="flex flex-col w-full min-[684px]:w-[600px] border-x-[1px]">
				<HeaderNav :totalPosts="user.totalPosts ?? 0" />

				<img
					:src="user.coverImg || '/default-cover.png'"
					alt="Cover image"
					class="w-full h-[200px] object-cover object-center"
				/>

				<div class="flex flex-col gap-4 px-4 py-3">
					<div class="flex justify-between items-center">
						<div>
							<img
								class="w-36 h-36 rounded-full ring ring-accent-foreground -mt-20 relative object-cover object-center"
								:src="user.profileImg || '/default-avatar.png'"
								:alt="user.username"
							/>
						</div>

						<Button
							v-if="user.username !== data?.username"
							class="rounded-full bg-sky-600"
						>
							Follow
						</Button>
					</div>

					<div>
						<div class="font-bold">
							{{ user.username }}
						</div>
						<div>@{{ user._id }}</div>
					</div>

					<div class="flex items-center gap-1">
						<Icon name="material-symbols:calendar-month" size="20" />
						Joined on {{ formattedCreatedAt }}
					</div>

					<div class="flex gap-4">
						<div>
							<b>{{ user.following?.length ?? 0 }}</b>
							following
						</div>
						<div>
							<b>{{ user.followers?.length ?? 0 }}</b>
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