'use client';

import { Card, CardContent } from '@/components/ui/card';
import { PostAvatar } from '@/components/post-card/post-avatar';
import { PostHeader } from '@/components/post-card/post-header';
import { PostContent } from '@/components/post-card/post-content';
import { PostFooter } from '@/components/post-card/post-footer';

import type { Post } from '@/lib/data';
import { getUserById } from '@/lib/data';

import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface PostCardProps {
  post: Post;
  variant?: 'default' | 'reply' | 'quote';
  isClickable?: boolean;
  className?: string;
}

export function PostCard({
  post,
  variant = 'default',
  isClickable = true,
  className,
}: PostCardProps) {
  const router = useRouter();

  const author = getUserById(post.authorId);

  if (!author) {
    return null; // or some fallback UI
  }

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;

    if (target.closest('[data-interactive]')) {
      return;
    }
    if (!isClickable) return;
    router.push(`/${author.username}/status/${post._id}`);
  };

  if (variant === 'reply') {
    return (
      <Card className={cn('py-0', className)}>
        <CardContent className="flex gap-3 px-0">
          <div className="flex flex-col h-full gap-3 items-center">
            <PostAvatar author={author} />
            <div className="bg-accent w-0.5 h-full"></div>
          </div>
          <div className="flex flex-col gap-1 w-full">
            <PostHeader post={post} showAvatar={false} showMoreButton={false} />
            <PostContent post={post} showMedia={false} truncate={true} />
          </div>
        </CardContent>
      </Card>
    );
  }

  // 🔹 Quote Layout
  if (variant === 'quote') {
    return (
      <Card className={cn('p-4 border rounded-2xl', className)}>
        <div className="flex flex-col gap-2">
          <PostHeader post={post} showMoreButton={false} avatarSize="sm" />
          <PostContent post={post} showMedia={true} truncate={true} />
        </div>
      </Card>
    );
  }

  // 🔹 Default Layout
  return (
    <Card
      className={cn(
        'flex flex-col gap-2 w-full px-4 py-3 border-b',
        isClickable &&
          'cursor-pointer hover:bg-secondary/20 transition-colors duration-200',
        className
      )}
      onClick={handleClick}
    >
      <PostHeader post={post} avatarSize="lg" />
      <PostContent post={post} truncate={isClickable} />
      <PostFooter post={post} />
    </Card>
  );
}
