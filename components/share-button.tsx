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
import { Link, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ShareButton() {
  return (
    <DropdownMenu>
      <Tooltip>
        <DropdownMenuTrigger asChild>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Share />
            </Button>
          </TooltipTrigger>
        </DropdownMenuTrigger>
        <TooltipContent side="bottom">
          <p>Share</p>
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent
        side={'top'}
        align="end"
        sideOffset={4}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DropdownMenuItem>
          <Link />
          Copy Link
        </DropdownMenuItem>
        {/* <DropdownMenuSeparator />
        <DropdownMenuItem>Log out</DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
