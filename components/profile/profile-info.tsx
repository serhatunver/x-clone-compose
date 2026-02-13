import { Button } from '@/components/ui/button';
import { Calendar, ChevronRight } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Field } from '@/components/ui/field';
import Link from 'next/link';

import { User } from '@/lib/data';

interface ProfileInfoProps {
  user: User;
}

export function ProfileInfo({ user }: ProfileInfoProps) {
  return (
    <div className="p-4 flex flex-col space-y-3">
      <div className="flex">
        <Button variant="outline" className="ml-auto rounded-full">
          Set up profile
        </Button>
      </div>
      <div>
        <Avatar className="size-36 rounded-full -mt-36 ring-4 ring-background">
          <AvatarImage src={user.avatar} alt={user.fullname} />
          <AvatarFallback className="rounded-lg">CN</AvatarFallback>
        </Avatar>
      </div>
      <div>
        <h1 className="text-lg font-bold">{user.fullname}</h1>
        <p className="text-sm text-muted-foreground">@{user.username}</p>
      </div>
      <div>{user.bio}</div>
      <Link href={`${user.username}/about`} className="hover:underline">
        <Field
          orientation="horizontal"
          className="text-muted-foreground text-sm gap-2"
        >
          <Calendar className="size-4" />
          <span>Joined October 2023</span>
          <ChevronRight className="size-4" />
        </Field>
      </Link>
      <Field orientation="horizontal" className="text-sm">
        <Link href={`${user.username}/following`} className="hover:underline">
          <span className="font-semibold">{user.followingCount}</span>
          <span className="text-muted-foreground ml-1">Following</span>
        </Link>
        <Link href={`${user.username}/followers`} className="hover:underline">
          <span className="font-semibold">{user.followersCount}</span>
          <span className="text-muted-foreground ml-1">Followers</span>
        </Link>
      </Field>
    </div>
  );
}
