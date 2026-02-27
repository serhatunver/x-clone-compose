import { AnimatedToggleButton } from '@/components/animated-toggle-button';
import { AnimateIcon } from '@/components/animate-ui/icons/icon';
import { Bookmark } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useState } from 'react';

export function BookmarkButton() {
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <AnimatedToggleButton
      tooltip="Bookmark"
      pressed={bookmarked}
      onPressedChange={setBookmarked}
      particleClassName="bg-sky-400/50 size-1 rounded-full"
    >
      {({ animate, pressed }) => (
        <AnimateIcon animate={animate} animation="path" persistOnAnimateEnd>
          <Bookmark
            className={cn(
              'transition-colors duration-200',
              pressed && 'fill-sky-400 stroke-sky-400'
            )}
          />
        </AnimateIcon>
      )}
    </AnimatedToggleButton>
  );
}
