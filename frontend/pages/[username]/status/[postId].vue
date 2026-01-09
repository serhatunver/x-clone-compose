<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import CreatePost from '~/components/home/CreatePost.vue';
import Post from '~/components/home/Post.vue';

const postsStore = usePostsStore();
const route = useRoute();

onBeforeMount(async () => {
  await postsStore.fetchPost(route.params.postId);
});
</script>

<template>
  <div
    class="flex lg:w-[920px] min-[1084px]:w-[990px] min-[1384px]:w-[1050px] justify-between"
  >
    <div
      v-if="postsStore.loading"
      class="flex h-screen justify-center items-center mx-auto"
    >
      <Icon name="svg-spinners:90-ring" size="32" class="text-blue-500" />
    </div>
    <div v-else>
      <HeaderNav :content="`Post`" />
      <PostDetail
        :post="postsStore.post"
        class="flex flex-col w-full min-[684px]:w-[600px] border-x-[1px]"
      />
      <CreatePost isComment="true" :postId="postsStore.post._id" />
      <Post
        v-for="comment in postsStore.post.comments"
        :post="comment"
        :key="comment._id"
      />
    </div>
    <!-- {{ post.comments }} -->
    <RightSide />
  </div>
</template>

<style scoped></style>
