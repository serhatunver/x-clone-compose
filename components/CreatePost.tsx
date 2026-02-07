'use client';

import React from 'react';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
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

const icons = {
  ImageIcon,
  Settings2,
  CalendarClock,
  Smile,
  Bot,
  MapPin,
};

export function CreatePost() {
  const [content, setContent] = React.useState('');
  return (
    <Card className="border-b py-4">
      <CardContent className="flex px-4">
        <Avatar className="size-10 rounded-full">
          <AvatarImage
            src="https://avatars.githubusercontent.com/u/96500903"
            alt="Serhat Ünver"
          />
          <AvatarFallback className="rounded-lg">CN</AvatarFallback>
        </Avatar>
        <div className="space-y-2 w-full max-w-[calc(100%-40px)]">
          {content.length > 0 && (
            <div className="text-sm text-muted-foreground">
              {content.length} / 280
            </div>
          )}
          <Textarea
            placeholder="Type your message here."
            className="resize-none text-lg"
            maxLength={280}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex flex-1">
            <div className="flex p-0.5">
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
            <Button className="ml-auto rounded-full">Post</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
