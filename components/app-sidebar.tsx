'use client';

import * as React from 'react';
import { Bell, Bookmark, Home, Search, Settings, User2 } from 'lucide-react';
import Link from 'next/link';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';

// This is sample data.
const data = {
  user: {
    name: 'Serhat Ünver',
    username: 'serhatunver',
    avatar: 'https://avatars.githubusercontent.com/u/96500903',
  },
  navMain: [
    {
      title: 'Home',
      url: '/',
      icon: Home,
      isActive: true,
    },
    {
      title: 'Explore',
      url: '/explore',
      icon: Search,
    },
    {
      title: 'Notifications',
      url: '/notifications',
      icon: Bell,
    },
    {
      title: 'Profile',
      url: '/serhatunver',
      icon: User2,
    },
    {
      title: 'Bookmarks',
      url: '/bookmarks',
      icon: Bookmark,
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: Settings,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} className="relative">
      <SidebarHeader
        className="
       pt-3 group-data-[state=expanded]:px-3 transition-[padding] duration-200 ease-out"
      >
        <Link href="/" className="hover:bg-accent size-12 p-3 rounded-full">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="size-6"
            fill="var(--color-background)"
          >
            <g>
              <path d="M21.742 21.75l-7.563-11.179 7.056-8.321h-2.456l-5.691 6.714-4.54-6.714H2.359l7.29 10.776L2.25 21.75h2.456l6.035-7.118 4.818 7.118h6.191-.008zM7.739 3.818L18.81 20.182h-2.447L5.29 3.818h2.447z"></path>
            </g>
          </svg>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
