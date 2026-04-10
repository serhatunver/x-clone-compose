import Link from 'next/link';
import { UserHoverCard } from '@/components/user-hover-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { User } from '@/lib/data';

interface PostAvatarProps {
  author: User;
  size?: 'sm' | 'default' | 'lg';
}

export function PostAvatar({ author, size = 'lg' }: PostAvatarProps) {
  return (
    <div>
      <UserHoverCard user={author}>
        <Link
          href={`/${author.username}`}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Avatar size={size}>
            <AvatarImage src={author.avatar} />
            <AvatarFallback className="rounded-lg">
              {author.fullname.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        </Link>
      </UserHoverCard>
    </div>
  );
}
