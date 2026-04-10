'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/animate-ui/components/radix/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';

interface AppTooltipProps {
  content?: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  hidden?: boolean;
}

export function AppTooltip({
  content,
  children,
  side = 'bottom',
  hidden,
}: AppTooltipProps) {
  const isMobile = useIsMobile();

  if (isMobile || !content || hidden) {
    return <>{children}</>;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side}>
        {typeof content === 'string' ? <p>{content}</p> : content}
      </TooltipContent>
    </Tooltip>
  );
}
