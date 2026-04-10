'use client';

import { useMemo } from 'react';

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/animate-ui/components/radix/tabs';
import { PostCard } from '@/components/post-card/post-card';
import { CreatePost } from '@/components/create-post';
import { VirtualList } from '@/components/virtual-list';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { useSmartHeader } from '@/hooks/use-smart-header';
import { cn } from '@/lib/utils';

const tabs = [
  { value: 'feed', label: 'Feed' },
  { value: 'following', label: 'Following' },
];

import { type Post, getFeedPosts } from '@/lib/data';

export function FeedTabs() {
  const posts = useMemo(() => getFeedPosts(), []);
  const headerVisible = useSmartHeader();

  if (posts.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">No posts yet.</div>
    );
  }

  return (
    <Tabs defaultValue="feed" className="w-full">
      <div
        className={cn(
          'sticky top-0 z-20 w-full bg-background/65 backdrop-blur-md border-b transition-transform duration-300',
          headerVisible ? 'translate-y-0' : '-translate-y-full',
          'md:translate-y-0'
        )}
      >
        <header className="px-4 py-2 flex items-center md:hidden">
          <SidebarTrigger className="rounded-full">
            <Avatar className="size-8 rounded-full">
              <AvatarImage
                src="https://avatars.githubusercontent.com/u/96500903"
                alt="Serhat Ünver"
              />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
          </SidebarTrigger>
        </header>

        <TabsList variant="line" className="w-full justify-start border-none">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <CreatePost className="border-b" />
      <TabsContent value="feed">
        <VirtualList
          key="feed-list"
          items={posts}
          renderItemComponent={PostCard}
        />
      </TabsContent>
      <TabsContent value="following">
        <VirtualList
          key="following-list"
          items={posts}
          renderItemComponent={PostCard}
        />
      </TabsContent>
    </Tabs>
  );
}
