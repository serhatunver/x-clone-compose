import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SearchBar } from '@/components/search-bar';

const tabs = [
  { value: 'trending', label: 'Trending' },
  { value: 'latest', label: 'Latest' },
  { value: 'people', label: 'People' },
  { value: 'photos', label: 'Photos' },
  { value: 'videos', label: 'Videos' },
];

export default function Explore() {
  return (
    <>
      <div className="px-4 my-1">
        <SearchBar />
      </div>
      <Tabs defaultValue="trending" className="w-full">
        <TabsList
          variant="line"
          className="w-full flex justify-start border-b overflow-x-auto whitespace-nowrap"
        >
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="trending" className="p-4">
          <div className="text-center text-muted-foreground">
            No trending posts yet.
          </div>
        </TabsContent>
        <TabsContent value="latest" className="p-4">
          <div className="text-center text-muted-foreground">
            No latest posts yet.
          </div>
        </TabsContent>
        <TabsContent value="people" className="p-4">
          <div className="text-center text-muted-foreground">
            No people found yet.
          </div>
        </TabsContent>
        <TabsContent value="photos" className="p-4">
          <div className="text-center text-muted-foreground">
            No photos found yet.
          </div>
        </TabsContent>
        <TabsContent value="videos" className="p-4">
          <div className="text-center text-muted-foreground">
            No videos found yet.
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
