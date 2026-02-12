import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { Field } from '@/components/ui/field';

import Image from 'next/image';
import Link from 'next/link';

import {
  Bookmark,
  Ellipsis,
  Heart,
  MessageCircle,
  Repeat2,
  Share,
} from 'lucide-react';

import { Toggle } from '@/components/ui/toggle';
import { ShareButton } from '@/components/share-button';
import { MoreButton } from '@/components/more-button';
import { UserHoverCard } from '@/components/user-hover-card';

export function PostCard() {
  const post = {
    user: {
      fullname: 'Serhat Ünver',
      username: 'serhatunver',
      avatar: 'https://avatars.githubusercontent.com/u/96500903',
      bio: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel, error?',
      followersCount: 10,
      followingCount: 9,
    },
    content:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eaque a adillo tenetur laboriosam fuga! Odio, eveniet at sit obcaecati modivel doloremque quam illo quos voluptates magni aliquam repellendus quae numquam ad veniam sed fuga natus eligendi ipsa. Aut nihil a provident maxime soluta beatae magnam minus repudiandae? Amet?',
    reply: 24,
    repost: 11,
    like: 123,
  };

  return (
    <Card className="border-b px-4 py-3">
      <div className="flex gap-3">
        <div>
          {/* <Tooltip>
            <TooltipTrigger asChild>
              <Link href={post.user.username}>
                <Avatar className="size-10 rounded-full">
                  <AvatarImage
                    src={post.user.avatar}
                    alt={post.user.fullname}
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
              </Link>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="flex flex-col w-full max-w-75 p-4 bg-background text-accent-foreground border gap-3"
              // hidden={state !== 'collapsed' || isMobile}
            >
              <div className="flex justify-between">
                <Avatar className="size-16 rounded-full">
                  <AvatarImage
                    src={post.user.avatar}
                    alt={post.user.fullname}
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <Button className="rounded-full">Follow</Button>
              </div>
              <div>
                <h1 className="text-lg font-bold leading-none">Serhat Ünver</h1>
                <p className="text-sm text-muted-foreground">@serhatunver</p>
              </div>
              <div className="text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit
                deserunt mollitia amet suscipit voluptate quam!
              </div>
              <Field orientation="horizontal" className="text-sm">
                <Link
                  href={`${post.user.username}/following`}
                  className="hover:underline"
                >
                  <span className="font-semibold">9</span>
                  <span className="text-muted-foreground ml-1">Following</span>
                </Link>
                <Link
                  href={`${post.user.username}/followers`}
                  className="hover:underline"
                >
                  <span className="font-semibold text-accent-foreground">
                    0
                  </span>
                  <span className="text-muted-foreground ml-1">Followers</span>
                </Link>
              </Field>
            </TooltipContent>
          </Tooltip> */}
          {/* <Link href={post.user.username}>
            <Avatar className="size-10 rounded-full">
              <AvatarImage src={post.user.avatar} alt={post.user.fullname} />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
          </Link> */}
          <UserHoverCard user={post.user}>
            <Link href={`/${post.user.username}`}>
              <Avatar className="size-10">
                <AvatarImage src={post.user.avatar} />
              </Avatar>
            </Link>
          </UserHoverCard>
        </div>
        <div className="flex flex-col w-full gap-1">
          {/* Header */}
          <div className="relative flex items-start justify-between">
            <div className="flex items-center gap-2 text-sm">
              <UserHoverCard user={post.user}>
                <Link href={post.user.username}>
                  <span className="font-semibold">{post.user.fullname}</span>
                </Link>
              </UserHoverCard>
              <UserHoverCard user={post.user}>
                <Link href={post.user.username}>
                  <span className="text-muted-foreground">
                    @{post.user.username}
                  </span>
                </Link>
              </UserHoverCard>
            </div>

            {/* <Button
              variant="ghost"
              size="icon"
              className="rounded-full absolute top-0 right-0"
            >
              <Ellipsis className="text-muted-foreground" />
            </Button> */}
            <div className="absolute top-0 right-0">
              <MoreButton />
            </div>
          </div>

          {/* Content */}
          <p className="text-sm">{post.content}</p>

          {/* Image (optional) */}
          {/* <Image
            src="https://pbs.twimg.com/media/HAVl940WMAAZcGd?format=jpg&name=small"
            alt="Event cover"
            className="rounded-lg aspect-auto w-full object-cover"
            width={400}
            height={225}
          /> */}

          {/* Footer */}
          <div className="flex items-end justify-between text-muted-foreground">
            <Button
              variant="ghost"
              size="default"
              className="rounded-full hover:bg-blue-500/30 dark:hover:bg-blue-500/30"
            >
              <MessageCircle className="mr-1 size-4" />
              {post.reply}
            </Button>

            <Button
              variant="ghost"
              size="default"
              className="rounded-full hover:bg-green-500/30 dark:hover:bg-green-500/30"
            >
              <Repeat2 className="mr-1 size-4.25" />
              {post.repost}
            </Button>

            <Toggle
              size="default"
              className="rounded-full gap-0.5 group/toggle data-[state=on]:bg-unset hover:bg-pink-500/15 hover:text-pink-600 data-[state=on]:text-pink-600!"
            >
              <Heart className="mr-1 size-4 group-data-[state=on]/toggle:fill-pink-600 group-data-[state=on]/toggle:stroke-pink-600" />
              {post.like}
            </Toggle>
            <div>
              <Toggle
                aria-label="Toggle bookmark"
                // size="sm"
                className="rounded-full group/toggle data-[state=on]:bg-unset"
              >
                <Bookmark className="group-data-[state=on]/toggle:fill-foreground group-data-[state=on]/toggle:stroke-foreground" />
              </Toggle>
              {/* <Button variant="ghost" size="xs" className="rounded-full">
                <Bookmark />
              </Button> */}
              {/* <Button variant="ghost" size="icon" className="rounded-full">
                <Share />
              </Button> */}
              <ShareButton />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
