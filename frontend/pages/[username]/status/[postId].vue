<script lang="ts" setup>
import { computed, watch } from 'vue';

const postsStore = usePostsStore();
const route = useRoute();

const postId = computed(() => String(route.params.postId || ''));
const post = computed(() => postsStore.selectedPost);
const isLoading = computed(() => postsStore.loading);
const error = computed(() => postsStore.error);

watch(
	() => postId.value,
	async (newPostId) => {
		if (!newPostId) return;

		try {
			await postsStore.fetchPost(newPostId);
		} catch (error) {
			console.error('Failed to load post:', error);
		}
	},
	{ immediate: true },
);
</script>

<template>
	<div
		class="flex w-full lg:w-[920px] min-[1084px]:w-[990px] min-[1384px]:w-[1050px] justify-between"
	>
		<div
			v-if="isLoading"
			class="flex w-full min-h-[300px] justify-center items-center mx-auto"
		>
			<Icon name="svg-spinners:90-ring" size="32" class="text-blue-500" />
		</div>

		<div
			v-else-if="error"
			class="flex w-full mx-auto min-h-[300px] items-center justify-center px-4 text-2xl text-red-500"
		>
			{{ error }}
		</div>

		<div
			v-else-if="!post"
			class="flex w-full min-h-[300px] items-center justify-center px-4 text-xl text-muted-foreground"
		>
			Post not found.
		</div>

		<div v-else class="border-x w-full min-[684px]:w-[600px]">
			<ProfileHeaderNav :content="'Post'" />

			<PostDetail :post="post" class="flex flex-col w-full" />

			<CreatePost isComment="true" :postId="post._id" />

			<Post
				v-for="comment in post.comments"
				:key="comment._id"
				:post="comment"
			/>
		</div>

		<RightSide />
	</div>
</template>

<style scoped></style>