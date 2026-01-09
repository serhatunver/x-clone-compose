<script lang="ts" setup></script>

<template>
  <div
    class="h-screen w-full justify-center flex flex-col min-[500px]:flex-row"
  >
    <header
      class="absolute bottom-0 flex z-50 bg-white w-full min-[500px]:w-auto min-[500px]:sticky min-[500px]:top-0"
    >
      <SidebarNav
        class="hidden min-[500px]:flex w-[68px] min-[600px]:w-[88px] xl:w-[275px]"
      />
      <BottomNav class="min-[500px]:hidden" />
    </header>
    <main
      class="h-screen flex lg:w-[920px] min-[1084px]:w-[990px] min-[1384px]:w-[1050px]"
    >
      <slot />
    </main>
  </div>
</template>

<style scoped></style>
