import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PostCard } from '@/components/post-card';

const tabs = [
  { value: 'posts', label: 'Posts' },
  { value: 'replies', label: 'Replies' },
  { value: 'media', label: 'Media' },
];

export function UserTabs() {
  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList
        variant="line"
        className="mx-auto w-full sticky top-0 h-13! border-b"
      >
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent
        value="posts"
        // className="max-h-[calc(100vh-36px)] overflow-y-auto"
      >
        <div className="">
          {Array.from({ length: 5 }).map((_, index) => (
            <PostCard key={index} />
          ))}
        </div>
      </TabsContent>
      <TabsContent value="replies">Replies</TabsContent>
      <TabsContent value="media">Media</TabsContent>
    </Tabs>
  );
}
