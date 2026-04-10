import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/animate-ui/components/radix/dialog';
import { AppTooltip } from '@/components/app-tooltip';
import { CreatePost } from '@/components/create-post';
import { PostCard } from '@/components/post-card/post-card';
import { CloseButton } from '@/components/close-button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Post } from '@/lib/data';
import { ReactNode } from 'react';

type DialogType = 'post' | 'reply' | 'quote';

interface AutoDialogProps {
  type: DialogType;
  post?: Post;
  trigger: ReactNode;
  children?: ReactNode;
}

const DIALOG_CONFIG = {
  post: {
    title: 'Create Post',
    description: 'Create a new post and share it with your followers.',
    tooltip: 'Post',
    variant: 'postDialog' as const,
  },
  reply: {
    title: 'Reply to Post',
    description: 'Join the conversation by replying to this post.',
    tooltip: 'Reply',
    variant: 'replyDialog' as const,
  },
  quote: {
    title: 'Quote Post',
    description: 'Share this post with your own thoughts.',
    tooltip: 'Repost',
    variant: 'quote' as const,
  },
};

export function AutoDialog({ type, post, trigger, children }: AutoDialogProps) {
  const isMobile = useIsMobile();
  const config = DIALOG_CONFIG[type];

  return (
    <Dialog>
      <AppTooltip content={config.tooltip}>
        <DialogTrigger data-interactive asChild>
          {trigger}
        </DialogTrigger>
      </AppTooltip>

      <DialogContent
        className={cn(
          'gap-0 p-4',
          isMobile && 'h-screen flex flex-col max-w-none rounded-none'
        )}
        showCloseButton={false}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{config.title}</DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>

        <CloseButton className="mb-3" />

        {type === 'reply' && post && <PostCard post={post} variant="reply" />}

        <CreatePost post={post} variant={config.variant} className="p-0" />

        {children}
      </DialogContent>
    </Dialog>
  );
}
