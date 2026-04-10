'use client';

import Link from 'next/link';
import { SearchIcon } from 'lucide-react';
import { AppTooltip } from '@/components/app-tooltip';
import { Button } from '@/components/animate-ui/components/buttons/button';

interface ProfileSearchProps {
  username: string;
  fullname: string;
}

export function ProfileSearch({ username, fullname }: ProfileSearchProps) {
  return (
    <AppTooltip content={`Search in ${fullname}'s profile`} side="right">
      <Button variant="ghost" size="icon" className="rounded-full" asChild>
        <Link href={`/explore`}>
          <SearchIcon />
        </Link>
      </Button>
    </AppTooltip>
  );
}
