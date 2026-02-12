import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { CreatePost } from '@/components/create-post';
import { SquarePen, X } from 'lucide-react';

import { useSidebar } from '@/components/ui/sidebar';

export function PostDialog() {
  const { state, isMobile } = useSidebar();
  return (
    <Dialog>
      <Tooltip>
        <DialogTrigger asChild>
          <TooltipTrigger asChild>
            <Button size="lg" className="rounded-full h-12">
              <span className="group-data-[state=collapsed]:hidden">Post</span>
              <SquarePen />
            </Button>
          </TooltipTrigger>
        </DialogTrigger>
        <TooltipContent side="right" hidden={state !== 'collapsed' || isMobile}>
          <p>Post</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent
        className="p-4 gap-0"
        showCloseButton={false}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Create Post</DialogTitle>
          <DialogDescription>
            Create a new post and share it with your followers.
          </DialogDescription>
        </DialogHeader>

        {/* Close button + Tooltip */}
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full"
              >
                <X />
              </Button>
            </DialogClose>
          </TooltipTrigger>
          <TooltipContent>Close</TooltipContent>
        </Tooltip>

        <CreatePost className="px-0 border-none" />
      </DialogContent>
    </Dialog>
  );
}
