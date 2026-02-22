'use client';

import Link from 'next/link';
import { SearchIcon } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

interface ProfileSearchProps {
  username: string;
  fullname: string;
}

export function ProfileSearch({ username, fullname }: ProfileSearchProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href={`/explore`} onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="icon" className="rounded-full">
            <SearchIcon />
          </Button>
        </Link>
      </TooltipTrigger>
      <TooltipContent>Search in {fullname}&apos;s profile</TooltipContent>
    </Tooltip>
  );
}
