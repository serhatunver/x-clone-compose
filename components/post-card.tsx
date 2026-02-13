import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import Image from 'next/image';
import Link from 'next/link';

import { Bookmark, Heart, MessageCircle, Repeat2 } from 'lucide-react';

import { Toggle } from '@/components/ui/toggle';
import { ShareButton } from '@/components/share-button';
import { MoreButton } from '@/components/more-button';
import { UserHoverCard } from '@/components/user-hover-card';

import { Post } from '@/lib/data';
import { getUserById } from '@/lib/data';

export function PostCard({ post }: { post: Post }) {
  const author = getUserById(post.authorId);

  if (!author) {
    return null; // or some fallback UI
  }
  return (
    <Card className="border-b px-4 py-3">
      <div className="flex gap-3">
        <div>
          <UserHoverCard user={author}>
            <Link href={`/${author.username}`}>
              <Avatar className="size-10">
                <AvatarImage src={author.avatar} />
                <AvatarFallback className="rounded-lg">
                  {author.fullname.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
            </Link>
          </UserHoverCard>
        </div>
        <div className="flex flex-col w-full gap-1">
          {/* Header */}
          <div className="relative flex items-start justify-between text-muted-foreground">
            <div className="flex items-center gap-1 text-sm">
              <UserHoverCard user={author}>
                <Link href={author.username}>
                  <span className="font-semibold text-foreground">
                    {author.fullname}
                  </span>
                </Link>
              </UserHoverCard>
              <UserHoverCard user={author}>
                <Link href={author.username}>
                  <span>@{author.username}</span>
                </Link>
              </UserHoverCard>
              <span>·</span>
              <span className="text-sm">
                {
                  // TODO: Format date properly (e.g., "2h ago", "Mar 5", etc.)
                  new Date(post.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })
                }
              </span>
            </div>
            <div className="absolute top-0 right-0">
              <MoreButton />
            </div>
          </div>

          {/* Content */}
          <p className="text-sm line-clamp-4 mr-10">{post.content}</p>

          {/* Image */}
          {post.media && (
            <div className="mt-2 rounded-lg overflow-hidden">
              <Image
                src={post.media}
                alt="Post image"
                width={800}
                height={600}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* Footer */}
          <div className="flex items-end justify-between text-muted-foreground">
            <Button
              variant="ghost"
              size="default"
              className="rounded-full hover:bg-blue-500/30 dark:hover:bg-blue-500/30"
            >
              <MessageCircle className="mr-1 size-4" />
              {post.comments.length}
            </Button>

            <Button
              variant="ghost"
              size="default"
              className="rounded-full hover:bg-green-500/30 dark:hover:bg-green-500/30"
            >
              <Repeat2 className="mr-1 size-4.25" />
              {post.repost.length}
            </Button>

            <Toggle
              size="default"
              className="rounded-full gap-0.5 group/toggle data-[state=on]:bg-unset hover:bg-pink-500/15 hover:text-pink-600 data-[state=on]:text-pink-600!"
            >
              <Heart className="mr-1 size-4 group-data-[state=on]/toggle:fill-pink-600 group-data-[state=on]/toggle:stroke-pink-600" />
              {post.likes.length}
            </Toggle>
            <div>
              <Toggle
                aria-label="Toggle bookmark"
                // size="sm"
                className="rounded-full group/toggle data-[state=on]:bg-unset"
              >
                <Bookmark className="group-data-[state=on]/toggle:fill-foreground group-data-[state=on]/toggle:stroke-foreground" />
              </Toggle>
              <ShareButton />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
