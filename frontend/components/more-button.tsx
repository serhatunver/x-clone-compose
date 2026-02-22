import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Ellipsis, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MoreButton() {
  return (
    <DropdownMenu>
      <Tooltip>
        <DropdownMenuTrigger asChild>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Ellipsis className="text-muted-foreground" />
            </Button>
          </TooltipTrigger>
        </DropdownMenuTrigger>
        <TooltipContent>
          <p>More</p>
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent
        side={'top'}
        align="end"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DropdownMenuItem className="text-red-600 hover:text-red-600!">
          <Trash2 className="text-red-600" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
