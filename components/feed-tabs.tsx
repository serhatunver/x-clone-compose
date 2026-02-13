import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PostCard } from '@/components/post-card';
import { CreatePost } from '@/components/create-post';

const tabs = [
  { value: 'feed', label: 'Feed' },
  { value: 'following', label: 'Following' },
];

import { getAllPosts } from '@/lib/data';

export function FeedTabs() {
  const posts = getAllPosts();
  return (
    <Tabs defaultValue="feed" className="w-full">
      <TabsList
        variant="line"
        // className="mx-auto w-full sticky top-0 h-13! border-b"
        className="sticky top-0 z-10 w-full border-b h-13! bg-background/80 backdrop-blur-2xl"
      >
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="feed" className="">
        <CreatePost />
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
      <TabsContent value="following">Following Content</TabsContent>
    </Tabs>
  );
}
