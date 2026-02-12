import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link, Ellipsis, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MoreButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Ellipsis className="text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side={'top'} align="center" sideOffset={0}>
        <DropdownMenuItem className="text-red-600 hover:text-red-600!">
          <Trash2 className="text-red-600" />
          Delete
        </DropdownMenuItem>
        {/* <DropdownMenuSeparator />
        <DropdownMenuItem>Log out</DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
