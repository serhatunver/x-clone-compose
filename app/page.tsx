import { FeedTabs } from '@/components/feed-tabs';

export default async function Home() {
  return (
    <div className="flex flex-1 overflow-hidden">
      <FeedTabs />
    </div>
  );
}
