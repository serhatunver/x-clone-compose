import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/animate-ui/components/buttons/button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/animate-ui/components/radix/popover';
import { Command, CommandList, CommandItem } from '@/components/ui/command';
import { AppTooltip } from '@/components/app-tooltip';

import { cn } from '@/lib/utils';

export interface DropdownItem {
  label: string;
  icon?: LucideIcon;
  onSelect?: () => void;
  destructive?: boolean;
  disabled?: boolean;
}

interface DropdownMenuProps {
  items: DropdownItem[];
  children?: React.ReactNode;
  triggerIcon?: LucideIcon;
  tooltip?: string;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'bottom' | 'left' | 'right';
}

export function DropdownMenu({
  items,
  children,
  triggerIcon: TriggerIcon,
  tooltip,
  align = 'end',
  side = 'bottom',
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (item: DropdownItem) => {
    if (item.disabled) return;
    item.onSelect?.();
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <AppTooltip content={tooltip ?? 'Menu'}>
        <PopoverTrigger asChild>
          {children ? (
            children
          ) : (
            <Button
              data-interactive
              variant="ghost"
              size="icon"
              className="rounded-full active:bg-accent transition-all duration-100"
            >
              {TriggerIcon && <TriggerIcon className="text-muted-foreground" />}
              <span className="sr-only">{tooltip ?? 'Menu'}</span>
            </Button>
          )}
        </PopoverTrigger>
      </AppTooltip>

      <PopoverContent
        align={align}
        side={side}
        className="p-0 w-auto min-w-48"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <Command>
          <CommandList>
            {items.map((item) => (
              <CommandItem
                key={item.label}
                disabled={item.disabled}
                className="flex items-center font-medium gap-2 p-0 text-base rounded-none cursor-pointer"
              >
                <div
                  className={cn(
                    'flex flex-1 px-4 py-2 items-center gap-2',
                    item.destructive && 'text-destructive',
                    item.disabled && 'cursor-not-allowed opacity-50'
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(item);
                  }}
                >
                  {item.icon && (
                    <item.icon
                      className={cn(
                        'size-5 text-foreground',
                        item.destructive && 'text-destructive'
                      )}
                    />
                  )}
                  <span>{item.label}</span>
                </div>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
