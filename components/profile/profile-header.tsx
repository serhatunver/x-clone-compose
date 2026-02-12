import { Button } from '@/components/ui/button';
import { SearchIcon } from 'lucide-react';

import { BackButton } from '@/components/back-button';

interface ProfileHeaderProps {
  username: string;
  postCount: number;
}

export function ProfileHeader({ username, postCount }: ProfileHeaderProps) {
  return (
    <div className="bg-background sticky top-0 z-50 flex items-center gap-4 border-b px-4 h-13">
      <BackButton />

      <div className="flex flex-col flex-1">
        <h1 className="text-lg font-bold">{username}</h1>
        <p className="text-xs text-muted-foreground">{postCount} posts</p>
      </div>

      <Button variant="ghost" size="icon" className="rounded-full">
        <SearchIcon />
      </Button>
    </div>
  );
}
