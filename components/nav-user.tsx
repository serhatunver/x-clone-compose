'use client';

import { ChevronsUpDown, LogOut, Plus } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu } from '@/components/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

export function NavUser({
  user,
}: {
  user: {
    name: string;
    username: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();

  const userActions = [
    {
      label: 'Add an existing account',
      icon: Plus,
      onSelect: () => console.log('Add an existing account'),
    },
    {
      label: `Log out @${user.username}`,
      icon: LogOut,
      destructive: true,
      onSelect: () => console.log(`Log out @${user.username}`),
    },
  ];

  return (
    <SidebarMenu>
      <DropdownMenu
        items={userActions}
        side={isMobile ? 'bottom' : 'top'}
        align="center"
      >
        <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground rounded-full px-1 gap-3 group-data-[collapsible=icon]:p-1! h-12 hover:cursor-pointer">
          <Avatar className="size-10 rounded-full">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name}</AvatarFallback>
          </Avatar>

          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{user.name}</span>
            <span className="truncate text-xs">@{user.username}</span>
          </div>

          <ChevronsUpDown className="ml-auto size-4" />
        </SidebarMenuButton>
      </DropdownMenu>
    </SidebarMenu>
  );
}
