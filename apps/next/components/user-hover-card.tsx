import Link from 'next/link';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/animate-ui/components/radix/hover-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { User } from '@/lib/data';

interface UserHoverCardProps {
  user: User;
  children: React.ReactNode;
}

export function UserHoverCard({ user, children }: UserHoverCardProps) {
  return (
    <HoverCard openDelay={600} closeDelay={200}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>

      <HoverCardContent
        side="bottom"
        align="center"
        className="w-75 p-4 rounded-lg"
      >
        {/* Header */}
        <div className="flex justify-between">
          <Link
            href={`/${user.username}`}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Avatar className="size-14">
              <AvatarImage src={user.avatar} alt={user.fullname} />
              <AvatarFallback>{user.fullname.slice(0, 2)}</AvatarFallback>
            </Avatar>
          </Link>

          <Button size="sm" className="rounded-full">
            Follow
          </Button>
        </div>

        {/* Name */}
        <div className="mt-3">
          <Link
            href={`/${user.username}`}
            className="font-semibold hover:underline"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {user.fullname}
          </Link>
          <Link
            href={`/${user.username}`}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <p className="leading-none text-sm text-muted-foreground">
              @{user.username}
            </p>
          </Link>
        </div>

        {/* Bio */}
        {user.bio && <p className="mt-2 text-sm">{user.bio}</p>}

        {/* Stats */}
        <Field orientation="horizontal" className="mt-3 text-sm">
          <Link
            href={`/${user.username}/following`}
            className="hover:underline"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <span className="font-semibold">{user.followingCount}</span>
            <span className="ml-1 text-muted-foreground">Following</span>
          </Link>

          <Link
            href={`/${user.username}/followers`}
            className="hover:underline"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <span className="font-semibold">{user.followersCount}</span>
            <span className="ml-1 text-muted-foreground">Followers</span>
          </Link>
        </Field>
      </HoverCardContent>
    </HoverCard>
  );
}
