'use client';

import { type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/animate-ui/components/buttons/button';

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { AutoDialog } from '@/components/auto-dialog';
import { SquarePen } from 'lucide-react';

import { usePathname } from 'next/navigation';

export interface NavItem {
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
              <Button
                variant="ghost"
                size="lg"
                className="justify-start font-normal"
                asChild
              >
                <Link href={item.url}>
                  {item.icon && <item.icon className="size-6" />}
                  <span className="">{item.title}</span>
                </Link>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        <AutoDialog
          type="post"
          trigger={
            <Button size="lg" className="rounded-full h-12">
              <span className="group-data-[state=collapsed]:hidden">Post</span>
              <SquarePen />
            </Button>
          }
        />
      </SidebarMenu>
    </SidebarGroup>
  );
}
