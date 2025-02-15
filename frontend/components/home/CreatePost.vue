<script lang="ts" setup>
// TODO logic should be in parent component

import { ref, h } from "vue";

import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/toast/use-toast";
import { ToastAction } from "@/components/ui/toast";

import Toaster from "@/components/ui/toast/Toaster.vue";

const { toast } = useToast();

const props = defineProps(["isComment", "postId"]);
const { token, data } = useAuth();
const postsStore = usePostsStore();

const loading = ref(false);

const postIcons = [
	{
		name: "material-symbols:gif-box-outline",
		size: "20",
	},
	{
		name: "ri:gemini-fill",
		size: "20",
	},
	{
		name: "material-symbols:imagesmode-outline",
		size: "24",
	},
	{
		name: "mynaui:smile-circle",
		size: "24",
	},
	{
		name: "material-symbols:location-on-outline",
		size: "24",
	},
];

const fromSchema = toTypedSchema(
	z.object({
		content: z.string().min(1, { message: "Content is required" }),
	})
);

const form = useForm({
	validationSchema: fromSchema,
});

const router = useRouter();

const post = ref({});

const submitPost = form.handleSubmit(async (values) => {
	console.log("login", values);
	loading.value = true;
	try {
		if (props.isComment) {
			const res = await fetch(
				`http://localhost:3000/api/v1/post/comment/${props.postId}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: token.value || "",
					},
					body: JSON.stringify(values),
				}
			);

			post.value = await res.json();
			await postsStore.fetchPost(props.postId);
			console.log(post.value);
			return;
		}

		const res = await fetch("http://localhost:3000/api/v1/post", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: token.value || "",
			},
			body: JSON.stringify(values),
		});

		post.value = await res.json();

		console.log(post.value);
	} catch (error) {
		console.error(error);
	} finally {
		loading.value = false;
		form.resetForm();
		toast({
			title: props.isComment
				? "Your comment was sent."
				: "Your post was sent.",
			action: h(
				ToastAction,
				{
					altText: "View",
					onclick: () => {
						router.push(
							`/${post.value.user?.username}/status/${post.value._id}`
						);
					},
				},
				{
					default: () => "View",
				}
			),
		});
		await postsStore.fetchPosts();
	}
});
</script>

<template>
	<div>
		<div class="flex px-4 pt-1">
			<div class="flex basis-10 mr-2 pt-2">
				<Avatar class="h-10 w-10 rounded-full">
					<AvatarImage
						:src="data?.profileImg"
						:alt="data?.username"
					/>
					<AvatarFallback class="rounded-lg">
						{{ data?.username.charAt(0) }}
					</AvatarFallback>
				</Avatar>
			</div>
			<form class="flex flex-col w-full" @submit="submitPost">
				<FormField v-slot="{ componentField }" name="content">
					<FormItem>
						<FormControl>
							<Textarea
								type="text"
								class="border-none py-4 text-md focus-visible:ring-0 focus-visible:ring-offset-0"
								:placeholder="
									isComment
										? 'Post your reply'
										: 'Share your thoughts...'
								"
								v-bind="componentField"
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>
				<div class="flex justify-between pb-2 mt-2">
					<div class="flex flex-1 gap-2 items-center p-0.5">
						<Button
							v-for="(icon, index) in postIcons"
							:key="index"
							variant="ghost"
							size="icon"
							class="rounded-full"
						>
							<Icon :name="icon.name" :size="icon.size" />
						</Button>
					</div>
					<div>
						<Button
							type="submit"
							:disabled="!form.meta.value.valid"
							class="rounded-full px-4 ml-3"
						>
							<template v-if="loading">
								<Icon
									name="svg-spinners:8-dots-rotate"
									size="18"
								/>
								{{ isComment ? "Replying" : "Posting" }}
							</template>
							<template v-else>
								{{ isComment ? "Reply" : "Post" }}
							</template>
						</Button>
					</div>
				</div>
			</form>
		</div>
		<Separator />
	</div>
</template>

<style scoped>
.ToastTitle {
	grid-area: title;
	margin-bottom: 5px;
	font-weight: 500;
	color: var(--slate-12);
	font-size: 32px;
}
</style>