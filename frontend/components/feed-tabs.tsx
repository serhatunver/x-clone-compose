'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PostCard } from '@/components/post-card/post-card';
import { CreatePost } from '@/components/create-post';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { useSmartHeader } from '@/hooks/use-smart-header';
import { cn } from '@/lib/utils';

const tabs = [
  { value: 'feed', label: 'Feed' },
  { value: 'following', label: 'Following' },
];

import { getAllPosts } from '@/lib/data';

export function FeedTabs() {
  const posts = getAllPosts();
  const headerVisible = useSmartHeader();

  if (posts.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">No posts yet.</div>
    );
  }

  return (
    <Tabs defaultValue="feed" className="w-full">
      <TabsList
        variant="line"
        className={cn(
          'flex flex-col sticky top-0 z-10 w-full border-b h-26! gap-0 bg-background/65 backdrop-blur-md transition-transform duration-300 md:translate-y-0',
          headerVisible ? 'translate-y-0' : '-translate-y-full',
          'md:h-13!'
        )}
      >
        <header className="h-13 px-4 z-10 flex w-full items-center md:hidden">
          <SidebarTrigger>
            <Avatar className="size-8 rounded-full">
              <AvatarImage
                src="https://avatars.githubusercontent.com/u/96500903"
                alt="Serhat Ünver"
              />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
          </SidebarTrigger>
        </header>
        <div className="flex w-full h-13">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </div>
      </TabsList>
      <CreatePost className="border-b" />
      <TabsContent value="feed" className="">
        {posts.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No posts yet.
          </div>
        ) : (
          <div className="">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </TabsContent>
      <TabsContent value="following">
        {posts.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No posts yet.
          </div>
        ) : (
          <div className="">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
