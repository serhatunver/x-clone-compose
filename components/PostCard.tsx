import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import Image from 'next/image';

import { Ellipsis, Heart, MessageCircle, Repeat2, Share } from 'lucide-react';

export function PostCard() {
  return (
    <Card className="border-b py-3 gap-2">
      {/* <div className="absolute inset-0 z-30 aspect-video bg-black/35" /> */}
      <CardHeader>
        <CardAction>
          <Button variant="ghost" size="icon" className="ml-2 rounded-full">
            <Ellipsis />
          </Button>
        </CardAction>
        <CardTitle className="flex items-center gap-2">
          <Avatar className="size-10 rounded-full">
            <AvatarImage
              src="https://avatars.githubusercontent.com/u/96500903"
              alt="Serhat Ünver"
            />
            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
          </Avatar>
          <span>Serhat Ünver</span>
          <span className="text-muted-foreground font-normal">
            @serhatunver
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="ml-10 flex flex-col gap-3">
        <p>Card Content</p>
        {/* <Image
          src="https://pbs.twimg.com/media/HAVl940WMAAZcGd?format=jpg&name=small"
          alt="Event cover"
          className="rounded-lg aspect-auto w-full object-cover"
          width={400}
          height={225}
        /> */}
      </CardContent>
      <CardFooter className="flex ml-10 gap-4 mt-2">
        <Button variant="ghost" size="sm" className="rounded-full">
          <MessageCircle className="mr-1" />
          <span>24</span>
        </Button>
        <Button variant="ghost" size="sm" className="ml-2 rounded-full">
          <Repeat2 className="mr-1" />
          <span>32</span>
        </Button>
        <Button variant="ghost" size="sm" className="ml-2 rounded-full">
          <Heart className="mr-1" />
          <span>128</span>
        </Button>
        <Button variant="ghost" size="icon" className="ml-auto rounded-full">
          <Share>Share</Share>
        </Button>
      </CardFooter>
    </Card>
  );
}
