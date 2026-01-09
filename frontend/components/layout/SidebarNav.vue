<script setup lang="ts">
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

const { signOut, data } = useAuth();

const route = useRoute();

interface Item {
  title: string;
  href: string;
  icon: string;
  activeIcon: string;
  variant: any;
}

const sidebarNavItems: Item[] = [
  {
    title: 'Home',
    href: '/home',
    icon: 'material-symbols:home-outline-rounded',
    activeIcon: 'material-symbols:home-rounded',
    variant: 'ghost',
  },
  {
    title: 'Explore',
    href: '/explore',
    icon: 'heroicons:magnifying-glass-solid',
    activeIcon: 'heroicons:magnifying-glass-20-solid',
    variant: 'ghost',
  },
  {
    title: 'Notifications',
    href: '/notifications',
    icon: 'si:notifications-alt-line',
    activeIcon: 'si:notifications-alt-fill',
    variant: 'ghost',
  },
  {
    title: 'Messages',
    href: '/messages',
    icon: 'heroicons:envelope',
    activeIcon: 'heroicons:envelope-16-solid',
    variant: 'ghost',
  },
  {
    title: 'Bookmarks',
    href: '/bookmarks',
    icon: 'si:bookmark-line',
    activeIcon: 'si:bookmark-fill',
    variant: 'ghost',
  },
  {
    title: 'Communities',
    href: '/communities',
    icon: 'bi:people',
    activeIcon: 'bi:people-fill',
    variant: 'ghost',
  },
  {
    title: 'Premium',
    href: '/premium',
    icon: 'line-md:twitter-x',
    activeIcon: 'line-md:twitter-x-fill',
    variant: 'ghost',
  },
  {
    title: 'Verified Orgs',
    href: '/verified-orgs',
    icon: 'si:verified-line',
    activeIcon: 'si:verified-fill',
    variant: 'ghost',
  },
  {
    title: 'Profile',
    href: `/${data.value?.username}`,
    icon: 'material-symbols:person-outline',
    activeIcon: 'material-symbols:person-rounded',
    variant: 'ghost',
  },
  {
    title: 'More',
    href: '/more',
    icon: 'si:more-horiz-circle-line',
    activeIcon: 'si:more-horiz-circle-fill',
    variant: 'ghost',
  },
];
</script>

<template>
  <div class="h-full flex flex-col justify-between items-center px-2">
    <div class="flex min-[500px]:flex-col">
      <div
        class="justify-center hidden min-[500px]:flex xl:justify-start ml-1 py-1"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          class="h-14 p-3 hover:bg-muted rounded-full"
        >
          <g>
            <path
              d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
            ></path>
          </g>
        </svg>
      </div>
      <div class="mt-0.5 mb-1">
        <nav
          class="flex min-[500px]:flex-col w-full justify-center items-center xl:justify-start xl:items-start rounded-full"
        >
          <a
            v-for="(link, index) of sidebarNavItems"
            :key="index"
            :href="link.href"
            :class="
              cn(
                buttonVariants({
                  variant: link.variant,
                  size: 'icon',
                }),
                link.variant === 'default' &&
                  'dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white',
                'gap-0 rounded-full xl:w-full hover:bg-muted h-12 w-12 xl:flex xl:items-center xl:justify-start xl:p-4',
                route.path === `${link.href}` && 'font-bold',
              )
            "
          >
            <Icon
              :name="
                (route.path === `${link.href}` && link.activeIcon) || link.icon
              "
              class="flex"
              size="28"
            />
            <span class="hidden xl:flex text-xl ml-5 mr-4">
              {{ link.title }}
            </span>
          </a>
        </nav>
      </div>
      <Button
        size="icon"
        class="flex rounded-full my-4 w-14 xl:w-full h-14 text-lg"
      >
        <Icon name="mdi:fountain-pen" size="18" class="xl:hidden" />
        <span class="hidden xl:flex"> Post </span>
      </Button>
    </div>

    <div
      class="hidden w-full justify-center min-[500px]:flex min-[500px]:justify-start my-3 p-3 rounded-full hover:bg-muted"
    >
      <DropdownMenu class="">
        <DropdownMenuTrigger class="w-full">
          <div
            class="flex justify-center items-center w-full hover:cursor-pointer"
          >
            <div class="flex items-center justify-center">
              <Avatar
                class="h-10 w-10 rounded-full shadow-lg border-2 border-white"
              >
                <AvatarImage :src="data?.profileImg" :alt="data?.username" />
                <AvatarFallback class="rounded-lg">
                  {{ data?.username.charAt(0) }}
                </AvatarFallback>
              </Avatar>
            </div>
            <div class="hidden xl:flex flex-col flex-1 text-left mx-3">
              <div class="font-bold">{{ data?.username }}</div>
              <div class="font-medium">@{{ data?.username }}</div>
            </div>
            <div class="hidden xl:flex">
              <Icon name="material-symbols:more-horiz" size="24" />
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="center"
          class="py-3 px-0 w-[300px] flex flex-col font-semibold rounded-2xl"
        >
          <DropdownMenuItem
            class="px-4 py-3 text-md rounded-none hover:cursor-pointer"
          >
            Add an existing account
          </DropdownMenuItem>
          <DropdownMenuItem
            @click="() => signOut({ callbackUrl: '/login' })"
            class="px-4 py-3 text-md rounded-none hover:cursor-pointer"
          >
            Log out @{{ data?.username }}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
</template>
