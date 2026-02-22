import { BackButton } from '@/components/back-button';

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
  return (
    <div className="sticky top-0 z-10 flex items-center gap-4 border-b px-4 h-13 bg-background/65 backdrop-blur-md">
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
