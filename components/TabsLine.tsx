import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PostCard } from '@/components/PostCard';
import { CreatePost } from './CreatePost';

const tabs = [
  { value: 'feed', label: 'Feed' },
  { value: 'following', label: 'Following' },
];

export function TabsLine() {
  return (
    <Tabs defaultValue="feed" className="w-full">
      <TabsList variant="line" className="mx-auto w-full sticky top-0 border-b">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent
        value="feed"
        className="max-h-[calc(100vh-36px)] overflow-y-auto"
      >
        {/* <div className="sticky top-0 z-10 bg-background"> */}
        <CreatePost />
        {/* </div> */}

        <div className="">
          {Array.from({ length: 20 }).map((_, index) => (
            <PostCard key={index} />
          ))}
        </div>
      </TabsContent>
      <TabsContent value="following">Following Content</TabsContent>
    </Tabs>
  );
}
