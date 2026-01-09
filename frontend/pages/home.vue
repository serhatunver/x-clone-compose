<script lang="ts" setup>
definePageMeta({
  title: 'Home',
});

const postsStore = usePostsStore();

onBeforeMount(async () => {
  await postsStore.fetchPosts();
});
</script>

<template>
  <div>
    <main
      class="flex lg:w-[920px] min-[1084px]:w-[990px] min-[1384px]:w-[1050px] justify-between"
    >
      <div class="flex w-full min-[684px]:w-[600px] border-r-[1px]">
        <Tabs default-value="forYou" class="w-full">
          <TabsList class="flex h-[52px] rounded-none bg-white p-0">
            <TabsTrigger
              class="flex-1 h-full rounded-none hover:bg-muted data-[state=active]:shadow-none data-[active=true]:border-b-2 data-[active=false]:border-white data-[active=true]:border-sky-500"
              value="forYou"
            >
              For you
            </TabsTrigger>
            <TabsTrigger
              class="flex-1 h-full rounded-none hover:bg-muted data-[state=active]:shadow-none data-[active=true]:border-b-2 data-[active=false]:border-white data-[active=true]:border-sky-500"
              value="following"
            >
              Following
            </TabsTrigger>
          </TabsList>
          <TabsContent value="forYou" class="mt-0">
            <ScrollArea
              class="h-screen flex"
              style="--scrollbar-size: 0px !important"
            >
              <div class="flex flex-col">
                <CreatePost />
                <div
                  v-if="postsStore.loading"
                  class="flex w-full h-screen justify-center items-center mx-auto"
                >
                  <Icon
                    name="svg-spinners:90-ring"
                    size="32"
                    class="text-blue-500"
                  />
                </div>
                <TransitionGroup v-else name="list" appear>
                  <Post
                    v-for="post in postsStore.posts"
                    :post="post"
                    :key="post._id"
                  />
                </TransitionGroup>
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="following" class="mt-0">
            <Post />
          </TabsContent>
        </Tabs>
      </div>
      <RightSide />
    </main>
  </div>
</template>

<style scoped></style>
