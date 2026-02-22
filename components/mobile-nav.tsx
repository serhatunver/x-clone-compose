'use client';

import { usePathname } from 'next/navigation';
import { useSmartHeader } from '@/hooks/use-smart-header';
import type { NavItem } from '@/components/nav-main';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

import { Home, Search, Bell, User2, Bookmark } from 'lucide-react';

const navItems = [
  {
    title: 'Home',
    url: '/',
    icon: Home,
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
];

export function MobileNav() {
  const pathname = usePathname();
  const headerVisible = useSmartHeader();

  const isActive = (navItem: NavItem) =>
    navItem.url === '/'
      ? pathname === '/'
      : pathname === navItem.url || pathname.startsWith(`${navItem.url}/`);

  return (
    <nav
      className={cn(
        'bg-background max-w-150 fixed w-full bottom-0 z-50 flex items-center justify-between border-t border-r h-13 md:hidden transition-all duration-300',
        !headerVisible && 'opacity-30'
      )}
    >
      {navItems.map((item) => (
        <div key={item.title} className="flex-1 flex justify-center">
          <Button
            variant="ghost"
            size="icon-lg"
            className={cn(
              'flex-col size-11 items-center rounded-full justify-center',
              'active:bg-accent transition-all duration-100',
              isActive(item) ? 'text-primary' : 'text-muted-foreground'
            )}
            asChild
          >
            <Link href={item.url}>
              <item.icon
                className={cn('size-6', isActive(item) && 'stroke-[2.5]')}
              />
            </Link>
          </Button>
        </div>
      ))}
    </nav>
  );
}
