import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Heart, MessageCircle, Repeat2 } from 'lucide-react';
import { ShareButton } from '@/components/share-button';
import { Post } from '@/lib/data';
import { ReplyDialog } from '@/components/reply-dialog';
import { QuoteDialog } from '@/components/quote-dialog';
import { BookmarkButton } from '@/components/bookmark-button';

interface PostFooterProps {
  post: Post;
}

export function PostFooter({ post }: PostFooterProps) {
  return (
    <div className="flex justify-between text-muted-foreground">
      <div onClick={(e) => e.stopPropagation()}>
        <ReplyDialog post={post}>
          <Button
            variant="ghost"
            size="default"
            className="rounded-full hover:bg-sky-400/50 dark:hover:bg-sky-400/50"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <MessageCircle className="mr-1 size-4" />
            {post.comments.length}
          </Button>
        </ReplyDialog>
      </div>

      <div onClick={(e) => e.stopPropagation()}>
        <QuoteDialog post={post}>
          <Button
            variant="ghost"
            size="default"
            className="rounded-full hover:bg-emerald-400/50 dark:hover:bg-emerald-400/50"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Repeat2 className="mr-1 size-4.25" />
            {post.repost.length}
          </Button>
        </QuoteDialog>
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <Toggle
              size="default"
              className="px-3 rounded-full group/toggle hover:bg-pink-500/50 dark:hover:bg-pink-500/50 gap-2 data-[state=on]:text-pink-600 data-[state=on]:bg-unset"
              onClick={(e) => e.stopPropagation()}
            >
              <Heart className="mr-1 size-4 group-data-[state=on]/toggle:fill-pink-600 group-data-[state=on]/toggle:stroke-pink-600" />
              {post.likes.length}
            </Toggle>
          </span>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Like</p>
        </TooltipContent>
      </Tooltip>

      <div>
        <BookmarkButton />
        <ShareButton />
      </div>
    </div>
  );
}
