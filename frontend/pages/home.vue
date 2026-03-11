<script lang="ts" setup>
import { computed, onMounted } from 'vue';

definePageMeta({
	title: 'Home',
});

const postsStore = usePostsStore();

const posts = computed(() => postsStore.posts);
const isLoading = computed(() => postsStore.loading);
const error = computed(() => postsStore.error);
const hasPosts = computed(() => posts.value.length > 0);

const tabTriggerClass =
	'flex-1 h-full rounded-none hover:bg-muted data-[state=active]:shadow-none data-[active=true]:border-b-2 data-[active=false]:border-white data-[active=true]:border-sky-500';

const loadPosts = async () => {
	try {
		await postsStore.fetchPosts();
	} catch (error) {
		console.error('Failed to load posts:', error);
	}
};

onMounted(loadPosts);
</script>

<template>
	<main
		class="flex lg:w-[920px] min-[1084px]:w-[990px] min-[1384px]:w-[1050px] justify-between"
	>
		<div class="flex w-full min-[684px]:w-[600px] border-x">
			<Tabs default-value="forYou" class="w-full">
				<TabsList class="flex h-[52px] rounded-none border-b bg-white p-0">
					<TabsTrigger :class="tabTriggerClass" value="forYou">
						For you
					</TabsTrigger>
					<TabsTrigger :class="tabTriggerClass" value="following">
						Following
					</TabsTrigger>
				</TabsList>

				<TabsContent value="forYou" class="mt-0">
					<ScrollArea
						class="flex h-screen"
						style="--scrollbar-size: 0px !important"
					>
						<div class="flex flex-col w-full">
							<CreatePost />

							<div
								v-if="isLoading"
								class="flex w-full min-h-[300px] justify-center items-center"
							>
								<Icon
									name="svg-spinners:90-ring"
									size="32"
									class="text-blue-500"
								/>
							</div>

							<div
								v-else-if="error"
								class="flex flex-col items-center justify-center min-h-[300px] gap-3 px-4 text-center"
							>
								<p class="text-sm text-red-500">
									{{ error }}
								</p>
								<Button
									variant="outline"
									class="rounded-full"
									@click="loadPosts"
								>
									Try again
								</Button>
							</div>

							<div
								v-else-if="!hasPosts"
								class="flex items-center justify-center min-h-[300px] px-4 text-sm text-muted-foreground"
							>
								No posts yet.
							</div>

							<TransitionGroup
								v-else
								name="list"
								appear
								tag="div"
								class="flex flex-col"
							>
								<Post v-for="post in posts" :key="post._id" :post="post" />
							</TransitionGroup>
						</div>
					</ScrollArea>
				</TabsContent>

				<TabsContent value="following" class="mt-0">
					<div
						class="flex items-center justify-center min-h-[300px] px-4 text-sm text-muted-foreground"
					>
						Following feed is not ready yet.
					</div>
				</TabsContent>
			</Tabs>
		</div>

		<RightSide />
	</main>
</template>

<style scoped></style>