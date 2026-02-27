import { Button } from '@/components/animate-ui/components/buttons/button';
import { X } from 'lucide-react';
import { AppTooltip } from '@/components/app-tooltip';
import { DialogClose } from '@/components/animate-ui/components/radix/dialog';
import { cn } from '@/lib/utils';

interface CloseButtonProps {
  className?: string;
}

export function CloseButton({ className }: CloseButtonProps) {
  return (
    <AppTooltip content="Close">
      <DialogClose asChild>
        <Button
          data-interactive
          variant="ghost"
          size="icon-lg"
          className={cn('rounded-full', className)}
        >
          <X className="size-5" />
          <span className="sr-only">Close</span>
        </Button>
      </DialogClose>
    </AppTooltip>
  );
}
