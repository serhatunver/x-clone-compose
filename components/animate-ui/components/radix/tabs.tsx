'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import {
  Tabs as TabsPrimitive,
  TabsList as TabsListPrimitive,
  TabsTrigger as TabsTriggerPrimitive,
  TabsContent as TabsContentPrimitive,
  TabsContents as TabsContentsPrimitive,
  TabsHighlight as TabsHighlightPrimitive,
  TabsHighlightItem as TabsHighlightItemPrimitive,
  type TabsProps as TabsPrimitiveProps,
  type TabsListProps as TabsListPrimitiveProps,
  type TabsTriggerProps as TabsTriggerPrimitiveProps,
  type TabsContentProps as TabsContentPrimitiveProps,
  type TabsContentsProps as TabsContentsPrimitiveProps,
} from '@/components/animate-ui/primitives/radix/tabs';

import { cn } from '@/lib/utils';

const TabsVariantContext = React.createContext<{ variant: 'default' | 'line' }>(
  {
    variant: 'default',
  }
);

function Tabs({ className, ...props }: TabsPrimitiveProps) {
  return (
    <TabsPrimitive
      className={cn('group/tabs flex flex-col', className)}
      {...props}
    />
  );
}

const tabsListVariants = cva(
  'relative inline-flex w-fit items-center justify-center transition-all',
  {
    variants: {
      variant: {
        default: 'bg-muted text-muted-foreground h-10 rounded-lg p-[3px]',
        line: 'bg-transparent text-muted-foreground border-b border-border h-13 rounded-none w-full justify-start',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

type TabsListProps = TabsListPrimitiveProps;

function TabsList({
  className,
  variant = 'default',
  ...props
}: TabsListProps & VariantProps<typeof tabsListVariants>) {
  const content = (
    <TabsListPrimitive
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  );

  return (
    <TabsVariantContext.Provider
      value={{ variant: variant as 'default' | 'line' }}
    >
      <div className="relative w-full">
        {variant === 'default' ? (
          <TabsHighlightPrimitive className="absolute inset-0 z-0 rounded-md border border-transparent bg-background shadow-sm dark:border-input dark:bg-input/30">
            {content}
          </TabsHighlightPrimitive>
        ) : (
          content
        )}
      </div>
    </TabsVariantContext.Provider>
  );
}

type TabsTriggerProps = TabsTriggerPrimitiveProps;

function TabsTrigger({ className, ...props }: TabsTriggerProps) {
  const { variant } = React.useContext(TabsVariantContext);

  const trigger = (
    <TabsTriggerPrimitive
      className={cn(
        'relative z-10 inline-flex flex-1 items-center justify-center px-4 py-2 h-full text-sm font-medium transition-colors duration-300',
        'focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:cursor-pointer data-[state=active]:text-foreground',

        variant === 'line' && [
          'rounded-none bg-transparent px-1',
          'after:absolute after:bottom-0 after:h-[2px] after:w-2/3 after:bg-primary after:transition-transform after:duration-300',
          'after:scale-x-0 data-[state=active]:after:scale-x-100',
        ],

        className
      )}
      {...props}
    />
  );

  if (variant === 'default') {
    return (
      <TabsHighlightItemPrimitive value={props.value} className="flex-1">
        {trigger}
      </TabsHighlightItemPrimitive>
    );
  }

  return trigger;
}

type TabsContentsProps = TabsContentsPrimitiveProps;

function TabsContents(props: TabsContentsProps) {
  return <TabsContentsPrimitive {...props} />;
}

type TabsContentProps = TabsContentPrimitiveProps;

function TabsContent({ className, ...props }: TabsContentProps) {
  return (
    <TabsContentPrimitive
      className={cn(
        'ring-offset-background focus-visible:outline-none transition={duration: 0}',
        className
      )}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContents, TabsContent };
