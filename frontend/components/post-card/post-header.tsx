import Link from 'next/link';
import { UserHoverCard } from '@/components/user-hover-card';
import { MoreButton } from '@/components/more-button';
import { Post } from '@/lib/data';
import { getUserById } from '@/lib/data';

import { PostAvatar } from '@/components/post-card/post-avatar';

interface PostHeaderProps {
  post: Post;
  showAvatar?: boolean;
  avatarSize?: 'sm' | 'default' | 'lg';
  showMoreButton?: boolean;
}

export function PostHeader({
  post,
  showAvatar = true,
  avatarSize = 'default',
  showMoreButton = true,
}: PostHeaderProps) {
  const author = getUserById(post.authorId);
  if (!author) return null;

  return (
    <div className="relative flex items-start gap-3 text-muted-foreground">
      {showAvatar && <PostAvatar author={author} size={avatarSize} />}

      <div className="flex items-center gap-2 text-sm mr-8 min-w-0">
        <div className="inline-flex flex-wrap gap-x-2 items-center">
          <UserHoverCard user={author}>
            <Link
              href={`/${author.username}`}
              className="truncate hover:underline font-semibold text-foreground"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {author.fullname}
            </Link>
          </UserHoverCard>
          <UserHoverCard user={author}>
            <Link
              href={`/${author.username}`}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <span>@{author.username}</span>
            </Link>
          </UserHoverCard>
        </div>
        <div className="flex gap-2 shrink-0 self-start">
          <span>·</span>
          <span className="text-sm">
            {new Date(post.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>
      {showMoreButton && (
        <div className="absolute -top-2 -right-2">
          <MoreButton />
        </div>
      )}
    </div>
  );
}
