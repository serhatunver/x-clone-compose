import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Bookmark } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';

export function BookmarkButton() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span>
          <Toggle
            aria-label="Toggle bookmark"
            className="rounded-full group/toggle data-[state=on]:bg-unset"
            onClick={(e) => e.stopPropagation()}
          >
            <Bookmark className="group-data-[state=on]/toggle:fill-sky-400 group-data-[state=on]/toggle:stroke-sky-400" />
          </Toggle>
        </span>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>Bookmark</p>
      </TooltipContent>
    </Tooltip>
  );
}
