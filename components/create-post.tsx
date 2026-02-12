'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Bot,
  CalendarClock,
  ImageIcon,
  MapPin,
  Settings2,
  Smile,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

import { AnimatedCircularProgressBar } from '@/components/ui/animated-circular-progress-bar';
import { cn } from '@/lib/utils';

const icons = {
  ImageIcon,
  Settings2,
  CalendarClock,
  Smile,
  Bot,
  MapPin,
};

export function CreatePost({ className }: { className?: string }) {
  const [content, setContent] = React.useState('');

  return (
    <Card className={cn('border-b p-4', className)}>
      <CardContent className="flex px-0">
        <Avatar className="size-10 rounded-full">
          <AvatarImage
            src="https://avatars.githubusercontent.com/u/96500903"
            alt="Serhat Ünver"
          />
          <AvatarFallback className="rounded-lg">CN</AvatarFallback>
        </Avatar>
        <div className="space-y-2 w-full max-w-[calc(100%-40px)]">
          <Textarea
            placeholder="Type your message here."
            className="resize-none text-lg dark:bg-transparent"
            maxLength={280}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex flex-1 justify-between">
            <div className="flex">
              {Object.entries(icons).map(([name, Icon]) => (
                <Button
                  key={name}
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-blue-500/10 dark:hover:bg-blue-500/30"
                >
                  <Icon className="size-4" color="var(--color-blue-500)" />
                </Button>
              ))}
            </div>
            <div className="flex gap-4">
              {content.length > 0 && (
                <AnimatedCircularProgressBar
                  className={cn(
                    content.length >= 260 ? 'scale-125' : 'scale-100',
                    'my-auto text-[10px] size-6 transition-scale duration-300'
                  )}
                  value={content.length}
                  max={280}
                  gaugePrimaryColor={
                    content.length < 260
                      ? 'var(--color-blue-500)'
                      : content.length < 280
                        ? 'var(--color-yellow-300)'
                        : 'var(--color-red-500)'
                  }
                  gaugeSecondaryColor="var(--color-gray-200)"
                  renderValue={(value, max) =>
                    value >= 260 ? max - value : ''
                  }
                />
              )}
              <Button
                disabled={content.length === 0 || content.length > 280}
                className="ml-auto rounded-full"
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
