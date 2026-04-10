import { CalendarClock, ImageIcon, Settings2, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';

const icons = [ImageIcon, Smile, CalendarClock];

export function ComposerActions() {
  return (
    <div className="flex gap-2">
      {icons.map((Icon, idx) => (
        <Button
          key={idx}
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-sky-400/10 dark:hover:bg-sky-400/30"
        >
          <Icon className="size-4" color="var(--color-sky-400)" />
        </Button>
      ))}
    </div>
  );
}
