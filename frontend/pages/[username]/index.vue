<script lang="ts" setup>
import { ref, onBeforeMount, computed } from 'vue';
const userStore = useUserStore();
const postsStore = usePostsStore();

const { data } = useAuth();

const route = useRoute();

// const user = ref<User>({
// 	_id: "",
// 	username: "",
// 	createdAt: "",
// 	posts: [],
// 	following: [],
// 	followers: [],
// 	totalPosts: 0,
// });
const loading = ref(false);

interface User {
  _id: string;
  username: string;
  createdAt: string;
  posts: any[];
  following: any[];
  followers: any[];
  totalPosts: number;
}

onBeforeMount(async () => {
  // const res = await fetch(
  // 	`http://localhost:3000/api/v1/user/profile/${route.params.username}`,
  // 	{
  // 		method: "GET",
  // 		headers: {
  // 			"Content-Type": "application/json",
  // 			Authorization: token.value || "",
  // 		},
  // 	}
  // );

  // const data = await res.json();
  // user.value = data;

  loading.value = true;
  try {
    await userStore.fetchUser(route.params.username);
    await postsStore.fetchUserPosts(route.params.username);
    user.value = userStore.user;
    console.log(user.value);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});

const user = computed(() => userStore.user);

const formattedCreatedAt = computed(() => {
  const date = new Date(user.value.createdAt);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
});
</script>

<template>
  <div class="flex lg:w-[920px] min-[1084px]:w-[990px] min-[1384px]:w-[1050px]">
    <div
      v-if="loading"
      class="flex w-full h-screen justify-center items-center mx-auto"
    >
      <Icon name="svg-spinners:90-ring" size="32" class="text-blue-500" />
    </div>
    <main
      v-else
      class="flex lg:w-[920px] min-[1084px]:w-[990px] min-[1384px]:w-[1050px] justify-between"
    >
      <div class="flex flex-col w-full min-[684px]:w-[600px] border-x-[1px]">
        <HeaderNav :totalPosts="user?.totalPosts" />
        <img
          :src="user?.coverImg"
          alt=""
          class="w-full h-[200px] object-cover object-center"
        />
        <div class="flex flex-col gap-4 px-4 py-3">
          <div class="flex justify-between items-center">
            <div>
              <img
                class="w-36 h-36 rounded-full border-4 border-white -mt-20 relative object-cover object-center"
                :src="user?.profileImg"
                :alt="user?.username"
              />
            </div>
            <Button
              v-if="user.username !== data.username"
              class="rounded-full bg-sky-600"
            >
              Follow
            </Button>
          </div>
          <div>
            <div class="font-bold">
              {{ user?.username }}
            </div>
            <div>@{{ user?._id }}</div>
          </div>
          <div class="flex items-center gap-1">
            <Icon name="material-symbols:calendar-month" size="20" />
            Joined on {{ formattedCreatedAt }}
          </div>
          <div class="flex gap-4">
            <div>
              <b>
                {{ user?.following?.length }}
              </b>
              following
            </div>
            <div>
              <b>
                {{ user?.followers?.length }}
              </b>
              <span> followers </span>
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
            <TabsTrigger
              class="flex-1 h-full rounded-none hover:bg-muted data-[state=active]:shadow-none data-[active=true]:border-b-2 data-[active=false]:border-white data-[active=true]:border-sky-500 text-md"
              value="subs"
            >
              Subs
            </TabsTrigger>
            <TabsTrigger
              class="flex-1 h-full rounded-none hover:bg-muted data-[state=active]:shadow-none data-[active=true]:border-b-2 data-[active=false]:border-white data-[active=true]:border-sky-500 text-md"
              value="highlights"
            >
              Highlights
            </TabsTrigger>
            <TabsTrigger
              class="flex-1 h-full rounded-none hover:bg-muted data-[state=active]:shadow-none data-[active=true]:border-b-2 data-[active=false]:border-white data-[active=true]:border-sky-500 text-md"
              value="media"
            >
              Media
            </TabsTrigger>
          </TabsList>
          <TabsContent value="posts" class="mt-0">
            <ScrollArea
              class="h-screen flex"
              style="--scrollbar-size: 0px !important"
            >
              <div class="flex flex-col">
                <TransitionGroup name="list" appear>
                  <Post
                    v-for="post in postsStore.userPosts"
                    :post="post"
                    :key="post._id"
                  />
                </TransitionGroup>
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="replies" class="mt-0">
            <Post />
          </TabsContent>
          <TabsContent value="subs" class="mt-0">
            <Post />
          </TabsContent>
          <TabsContent value="highlights" class="mt-0">
            <Post />
          </TabsContent>
          <TabsContent value="media" class="mt-0">
            <Post />
          </TabsContent>
        </Tabs>
      </div>
      <!-- <div class="flex flex-col gap-4 px-4 py-3">
				<div class="font-bold text-xl">Posts</div>
				<div class="grid gap-4">
					<div v-for="post in user.posts" :key="post._id">
						<div class="flex items-center gap-4">
							<img
								class="w-10 h-10 rounded-full"
								:src="post.user.avatar"
								:alt="post.user.username"
							/>
							<div>
								<div class="font-bold">
									{{ post.user.username }}
								</div>
								<div class="text-sm">
									{{ post.content }}
								</div>
							</div>
						</div>
						<Seperator label="test" />
					</div>
				</div>
			</div> -->
      <RightSide />
    </main>
  </div>
</template>

<style scoped></style>
