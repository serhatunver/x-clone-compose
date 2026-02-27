'use client';

import * as React from 'react';
import { useWindowVirtualizer } from '@tanstack/react-virtual';

type VirtualListProps<T> = {
  items: T[];
  renderItemComponent?: React.ComponentType<{ post: T }>;
  renderItem?: (item: T, index: number) => React.ReactNode;
  estimateSize?: number;
  overscan?: number;
  getItemKey?: (item: T, index: number) => string | number;
  className?: string;
};

export function VirtualList<T>({
  items,
  estimateSize = 300,
  overscan = 5,
  getItemKey,
  renderItem,
  renderItemComponent: ItemComponent,
  className,
}: VirtualListProps<T>) {
  const rowVirtualizer = useWindowVirtualizer({
    count: items.length,
    estimateSize: () => estimateSize,
    overscan,
    getItemKey: (index) =>
      getItemKey ? getItemKey(items[index], index) : index,
  });

  return (
    <div
      className={className}
      style={{
        height: `${rowVirtualizer.getTotalSize()}px`,
        width: '100%',
        position: 'relative',
      }}
    >
      {rowVirtualizer.getVirtualItems().map((virtualItem) => {
        const item = items[virtualItem.index];

        return (
          <div
            key={virtualItem.key}
            ref={rowVirtualizer.measureElement}
            data-index={virtualItem.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {renderItem ? (
              renderItem(item, virtualItem.index)
            ) : ItemComponent ? (
              <ItemComponent post={item} />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
