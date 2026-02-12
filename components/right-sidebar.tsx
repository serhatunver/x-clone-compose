'use client';

import { useIsDesktop } from '@/hooks/use-desktop';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { SearchBar } from '@/components/search-bar';

export const RightSidebar = () => {
  return (
    <div className="max-w-sm hidden lg:block space-y-4 mt-2">
      <SearchBar />
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="border rounded-2xl bg-background">
          <CardHeader>
            <CardTitle>Right Sidebar</CardTitle>
            <CardDescription>
              This is the right sidebar. It is hidden on screens smaller than
              1024px.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              You can put any content here. For example, you can put a list of
              trending topics, or a list of online friends, or a list of recent
              notifications.
            </p>
          </CardContent>
        </Card>
      ))}

      <div>{useIsDesktop() ? 'true' : 'false'}</div>
    </div>
  );
};
