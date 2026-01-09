<script lang="ts" setup>
const props = defineProps(['icon', 'username']);
const emit = defineEmits(['delete-post']);
const deletePost = () => {
  emit('delete-post', '');
};

const { data } = useAuth();
</script>

<template>
  <DropdownMenu class="">
    <DropdownMenuTrigger class="w-full flex items-center justify-center">
      <Icon :name="props.icon" size="16" />
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="end"
      :align-offset="0"
      :side-offset="-25"
      side="bottom"
      :loop="true"
      class="p-0 flex flex-col font-semibold rounded-2xl"
    >
      <DropdownMenuItem
        v-if="data?.username === username"
        @click="deletePost()"
        class="flex gap-0 items-end px-4 py-3 rounded-none !text-red-500"
      >
        <div class="flex pr-2">
          <Icon name="material-symbols:delete-outline" size="18" />
        </div>
        <div>Delete</div>
      </DropdownMenuItem>
      <DropdownMenuItem class="flex gap-0 items-end px-4 py-3 rounded-none">
        <div class="flex pr-2">
          <Icon name="ri:link" size="18" />
        </div>
        <div>Copy link</div>
      </DropdownMenuItem>
      <DropdownMenuItem class="flex gap-0 items-center px-4 py-3 rounded-none">
        <div class="flex pr-2">
          <Icon name="ri:share-2-line" size="18" />
        </div>
        <div>Share post via ...</div>
      </DropdownMenuItem>
      <DropdownMenuItem class="flex gap-0 items-end px-4 py-3 rounded-none">
        <div class="flex pr-2">
          <Icon name="material-symbols:mail-outline" size="18" />
        </div>
        <div>Send via Direct Message</div>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<style scoped></style>
