import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/animate-ui/components/radix/tabs';
import { PostCard } from '@/components/post-card/post-card';
import { VirtualList } from '@/components/virtual-list';

const tabs = [
  { value: 'posts', label: 'Posts' },
  { value: 'replies', label: 'Replies' },
  { value: 'media', label: 'Media' },
];

import type { User } from '@/lib/data';

export function UserTabs({ user }: { user: User }) {
  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList variant="line" className="mx-auto w-full h-13! border-b">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="posts">
        {user.posts?.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No posts yet.
          </div>
        ) : (
          <VirtualList
            items={user.posts || []}
            renderItemComponent={PostCard}
          />
        )}
      </TabsContent>
      <TabsContent value="replies">Replies</TabsContent>
      <TabsContent value="media">Media</TabsContent>
    </Tabs>
  );
}
