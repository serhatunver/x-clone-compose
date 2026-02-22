import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogPortal,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { CreatePost } from '@/components/create-post/create-post';
import { X } from 'lucide-react';

import { useSidebar } from '@/components/ui/sidebar';
import { Post } from '@/lib/data';
import { cn } from '@/lib/utils';
import { PostCard } from '@/components/post-card/post-card';

interface ReplyDialogProps {
  post: Post;
  children?: React.ReactNode;
}

export function ReplyDialog({ post, children }: ReplyDialogProps) {
  const { isMobile } = useSidebar();

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>{children}</DialogTrigger>
        </TooltipTrigger>

        <TooltipContent side="bottom" hidden={isMobile}>
          <p>Reply</p>
        </TooltipContent>
      </Tooltip>

      {/* <DialogPortal> */}
      <DialogContent
        className={cn(
          'p-4 gap-0',
          isMobile && 'h-screen flex flex-col max-w-none rounded-none'
        )}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
        showCloseButton={false}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Reply to Post</DialogTitle>
          <DialogDescription>
            Join the conversation by replying to this post.
          </DialogDescription>
        </DialogHeader>

        {/* Close button + Tooltip */}
        <div className="flex justify-start">
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                >
                  <X className="size-5" />
                </Button>
              </DialogClose>
            </TooltipTrigger>
            <TooltipContent>Close</TooltipContent>
          </Tooltip>
        </div>

        <PostCard post={post} variant="reply" />
        <CreatePost post={post} variant="replyDialog" className="p-0" />
      </DialogContent>
      {/* </DialogPortal> */}
    </Dialog>
  );
}
