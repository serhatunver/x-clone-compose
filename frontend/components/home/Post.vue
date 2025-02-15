<script lang="ts" setup>
import { ref } from "vue";
import CreatePost from "./CreatePost.vue";
const postsStore = usePostsStore();

const isBookmark = ref(false);
const isLiked = ref(false);

const toggleBookmark = () => {
	isBookmark.value = !isBookmark.value;
};

const toggleLike = () => {
	isLiked.value = !isLiked.value;
};

const props = defineProps(["post"]);

const deletePost = async () => {
	const postId = props.post._id;
	await postsStore.deletePost(postId);
};
</script>

<template>
	<NuxtLink :to="`/${post.user?.username}/status/${post._id}`">
		<div class="flex border-b px-4 py-3 hover:bg-slate-50">
			<div class="flex basis-10 mr-2">
				<Avatar>
					<AvatarImage :src="post.user?.profileImg" alt="avatar" />
					<AvatarFallback>
						{{ post.user?.username[0] }}
					</AvatarFallback>
				</Avatar>
			</div>
			<div class="right flex flex-col w-full">
				<div class="flex w-full h-5 justify-between items-center gap-1">
					<div class="flex items-center">
						<div class="flex font-bold">
							<NuxtLink :to="`/${post.user?.username}`">
								{{ post.user?.username }}
							</NuxtLink>
						</div>
						<Icon
							name="material-symbols:verified"
							size="20"
							class="text-amber-500"
						/>
						<div class="ml-1">@{{ post.user?.username }}</div>
						<div class="px-1">·</div>
						<div>7h</div>
					</div>
					<div>
						<Button
							variant="ghost"
							size="icon"
							class="rounded-full hover:bg-sky-100 hover:text-sky-500"
						>
							<Dropdown
								@delete-post="deletePost"
								icon="ri:more-fill"
								:username="post.user?.username"
							/>
						</Button>
					</div>
				</div>
				<div>
					<p>
						{{ post.content }}
					</p>
				</div>
				<div class="mt-3">
					<!-- <img
						class="rounded-xl border"
						src="https://picsum.photos/600/300"
						alt=""
					/> -->
				</div>
				<div class="mt-3">
					<div class="flex justify-between">
						<div class="flex flex-1 justify-between mr-8">
							<Dialog>
								<DialogTrigger as-child>
									<Button
										@click.prevent
										variant="ghost"
										class="items-center hover:bg-sky-100 rounded-full hover:text-sky-500"
									>
										<Icon
											name="tabler:message-circle"
											size="18"
										/>
										<div class="">
											{{ post.comments?.length }}
										</div>
									</Button>
								</DialogTrigger>
								<DialogContent class="p-2 !rounded-2xl">
									<CreatePost isComment="true" />
								</DialogContent>
							</Dialog>

							<Button
								variant="ghost"
								@click.prevent=""
								class="items-center hover:bg-green-100 rounded-full hover:text-green-500"
							>
								<Icon name="zondicons:repost" size="18" />
								<div class="">
									{{ post.reposts?.length }}
								</div>
							</Button>
							<Button
								variant="ghost"
								class="items-center hover:bg-red-100 rounded-full hover:text-red-500"
								@click.prevent="toggleLike"
							>
								<Icon
									v-if="isLiked"
									name="ri:heart-fill"
									size="18"
									class="text-red-500"
								/>
								<Icon v-else name="ri:heart-line" size="18" />
								<div v-if="isLiked" class="text-red-500">
									{{ post.likes?.length }}
								</div>
								<div v-else class="">
									{{ post.likes?.length }}
								</div>
							</Button>
							<Button
								variant="ghost"
								@click.prevent=""
								class="items-center hover:bg-sky-100 rounded-full hover:text-sky-500"
							>
								<Icon
									name="lucide:chart-no-axes-column"
									size="18"
								/>
								<div class="">351K</div>
							</Button>
						</div>
						<div class="flex">
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger as-child>
										<Button
											variant="ghost"
											size="icon"
											class="flex p-0 ml-auto rounded-full hover:bg-sky-100 hover:text-sky-500"
											@click.prevent="toggleBookmark"
										>
											<Icon
												v-if="isBookmark"
												name="material-symbols:bookmark"
												size="18"
												class="text-sky-500"
											/>
											<Icon
												v-else
												name="material-symbols:bookmark-outline"
												size="18"
											/>
										</Button>
									</TooltipTrigger>
									<TooltipContent
										side="bottom"
										class="py-px px-2 bg-slate-800 text-white text-xs"
									>
										<p v-if="isBookmark">
											Remove from bookmarks
										</p>
										<p v-else>Bookmark</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>

							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger as-child>
										<Button
											variant="ghost"
											size="icon"
											class="flex p-0 rounded-full hover:bg-sky-100 hover:text-sky-500"
										>
											<Dropdown icon="ri:share-2-line" />
										</Button>
									</TooltipTrigger>
									<TooltipContent
										side="bottom"
										class="py-px px-2 bg-slate-800 text-white text-xs"
									>
										<p>Share</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
					</div>
				</div>
			</div>
		</div>
	</NuxtLink>
</template>



<style scoped>
</style>