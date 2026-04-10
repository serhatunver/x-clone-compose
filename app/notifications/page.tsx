import { PageHeader } from '@/components/page-header';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/animate-ui/components/radix/tabs';

export default function Notifications() {
  return (
    <>
      <PageHeader title="Notifications" />
      <Tabs defaultValue="all" className="w-full">
        <TabsList variant="line" className="w-full border-b">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="mentions">Mentions</TabsTrigger>
          <TabsTrigger value="likes">Likes</TabsTrigger>
          <TabsTrigger value="follows">Follows</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="p-4">
          <div className="text-center text-muted-foreground">
            No notifications yet.
          </div>
        </TabsContent>
        <TabsContent value="mentions" className="p-4">
          <div className="text-center text-muted-foreground">
            No mentions yet.
          </div>
        </TabsContent>
        <TabsContent value="likes" className="p-4">
          <div className="text-center text-muted-foreground">No likes yet.</div>
        </TabsContent>
        <TabsContent value="follows" className="p-4">
          <div className="text-center text-muted-foreground">
            No new followers yet.
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
