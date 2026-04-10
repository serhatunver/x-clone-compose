import { Button } from '@/components/animate-ui/components/buttons/button';
import { ShareButton } from '@/components/share-button';
import { Post } from '@/lib/data';
import { AutoDialog } from '@/components/auto-dialog';
import { LikeButton } from '@/components/like-button';
import { BookmarkButton } from '@/components/bookmark-button';

import { Repeat2 } from 'lucide-react';
import { MessageCircle } from '@/components/animate-ui/icons/message-circle';
import { AnimateIcon } from '@/components/animate-ui/icons/icon';
interface PostFooterProps {
  post: Post;
}

export function PostFooter({ post }: PostFooterProps) {
  return (
    <div className="flex justify-between text-muted-foreground">
      <AutoDialog
        type="reply"
        trigger={
          <Button
            variant="ghost"
            size="default"
            className="rounded-full hover:bg-sky-400/50 dark:hover:bg-sky-400/50"
          >
            <AnimateIcon>
              <MessageCircle />
            </AnimateIcon>
            {post.comments.length}
          </Button>
        }
        post={post}
      />

      <AutoDialog
        type="quote"
        trigger={
          <Button
            variant="ghost"
            size="default"
            className="rounded-full hover:bg-emerald-400/50 dark:hover:bg-emerald-400/50"
          >
            <Repeat2 className="mr-1 size-4.25" />
            {post.repost.length}
          </Button>
        }
        post={post}
      />

      <LikeButton post={post} />

      <div>
        <BookmarkButton />
        <ShareButton />
      </div>
    </div>
  );
}
