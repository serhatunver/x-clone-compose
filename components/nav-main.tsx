'use client';

import { type LucideIcon } from 'lucide-react';
import Link from 'next/link';

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { PostDialog } from '@/components/post-dialog';

import { usePathname } from 'next/navigation';

interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
}

interface NavMainProps {
  items: NavItem[];
}

export function NavMain({ items }: NavMainProps) {
  const pathname = usePathname();

  const isActive = (navItem: NavItem) =>
    navItem.url === '/'
      ? pathname === '/'
      : pathname === navItem.url || pathname.startsWith(`${navItem.url}/`);

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title} className="rounded-full">
            <SidebarMenuButton
              className="rounded-full h-12 text-base px-4"
              isActive={isActive(item)}
              tooltip={item.title}
              asChild
            >
              <Link href={item.url}>
                {item.icon && <item.icon className="size-4" />}
                <span className="">{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        <PostDialog />
      </SidebarMenu>
    </SidebarGroup>
  );
}
