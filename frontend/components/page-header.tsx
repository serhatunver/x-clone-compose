'use client';

import { BackButton } from '@/components/back-button';
import { useSmartHeader } from '@/hooks/use-smart-header';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  rightAction?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  rightAction,
}: PageHeaderProps) {
  const headerVisible = useSmartHeader();

  return (
    <div
      className={cn(
        'sticky top-0 z-10 flex items-center gap-4 border-b px-4 h-13 bg-background/65 backdrop-blur-md transition-transform duration-300',
        headerVisible ? 'translate-y-0' : '-translate-y-full'
      )}
    >
      <BackButton />

      <div className="flex flex-col flex-1">
        <h1 className="text-lg font-bold">{title}</h1>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>

      {rightAction}
    </div>
  );
}
