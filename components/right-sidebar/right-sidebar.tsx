'use client';

import { SearchBar } from '@/components/search-bar';
import { WhoToFollow } from './who-to-follow';
import { TrendingTopics } from './trending-topics';

export const RightSidebar = () => {
  return (
    <div className="w-80 space-y-4 fixed top-0 self-start">
      <div className="w-full py-1 z-10 bg-background/70 backdrop-blur-2xl">
        <SearchBar />
      </div>
      <TrendingTopics />
      <WhoToFollow />
    </div>
  );
};
