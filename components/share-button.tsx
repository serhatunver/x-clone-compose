import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ShareButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Share />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        // className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side={'top'}
        align="center"
        sideOffset={0}
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
