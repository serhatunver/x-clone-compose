<script lang="ts" setup>
import { ref } from 'vue';

const isBookmark = ref(false);
const isLiked = ref(false);

const toggleBookmark = () => {
  isBookmark.value = !isBookmark.value;
};

const toggleLike = () => {
  isLiked.value = !isLiked.value;
};

const props = defineProps(['post']);
</script>

<template>
  <NuxtLink :to="`/${post.user?.username}/status/${post._id}`">
    <div class="flex border-b px-4 py-3 hover:bg-slate-50">
      <div class="right flex flex-col w-full">
        <div class="flex w-full justify-between items-center gap-1">
          <div class="flex items-center gap-2">
            <Avatar>
              <AvatarImage :src="post.user?.profileImg" alt="avatar" />
              <AvatarFallback>
                {{ post.user?.username[0] }}
              </AvatarFallback>
            </Avatar>
            <div class="flex flex-col items-start">
              <div class="flex">
                <div class="flex font-bold">
                  <NuxtLink
                    :to="`/${post.user?.username}`"
                    class="flex items-center"
                  >
                    {{ post.user?.username }}
                    <Icon
                      name="material-symbols:verified"
                      size="20"
                      class="text-amber-500"
                    />
                  </NuxtLink>
                </div>
              </div>
              <div>@{{ post.user?.username }}</div>
            </div>
          </div>
          <div>
            <Button
              variant="ghost"
              size="icon"
              class="rounded-full hover:bg-sky-100 hover:text-sky-500"
            >
              <Dropdown icon="ri:more-fill" />
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
        <div class="mt-3 border-y py-2">
          <div class="flex justify-between">
            <div class="flex flex-1 justify-between">
              <Dialog>
                <DialogTrigger as-child>
                  <Button
                    variant="ghost"
                    class="items-center p-0 hover:bg-sky-100 rounded-full hover:text-sky-500"
                  >
                    <Icon name="tabler:message-circle" size="18" />
                    <div class="">
                      {{ post.comments?.length }}
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent class="p-2 !rounded-2xl">
                  <DialogHeader>
                    <DialogClose as-child>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        class="rounded-full bg-transparent hover:bg-muted"
                      >
                        <Icon name="ri:close-line" size="18" />
                      </Button>
                    </DialogClose>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                      Make changes to your profile here. Click save when you're
                      done.
                    </DialogDescription>
                  </DialogHeader>

                  <DialogFooter class="flex justify-between">
                    <div class="flex flex-1 gap-2 items-center">
                      <Icon
                        v-for="i in 6"
                        :key="i"
                        name="material-symbols:imagesmode-outline"
                        size="24"
                        class="text-sky-500"
                      />
                    </div>
                    <div>
                      <Button disabled class="rounded-full px-4 h-7">
                        Reply
                      </Button>
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button
                variant="ghost"
                class="items-center p-0 hover:bg-green-100 rounded-full hover:text-green-500"
              >
                <Icon name="zondicons:repost" size="18" />
                <div class="">
                  {{ post.reposts?.length }}
                </div>
              </Button>
              <Button
                variant="ghost"
                class="items-center p-0 hover:bg-red-100 rounded-full hover:text-red-500"
                @click="toggleLike"
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
                class="items-center p-0 hover:bg-sky-100 rounded-full hover:text-sky-500"
              >
                <Icon name="lucide:chart-no-axes-column" size="18" />
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
                      @click="toggleBookmark"
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
                    <p v-if="isBookmark">Remove from bookmarks</p>
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

<style scoped></style>
