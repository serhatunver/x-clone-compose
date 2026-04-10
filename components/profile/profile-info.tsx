import { Button } from '@/components/ui/button';
import { Calendar, ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ImagePreview } from '@/components/image-preview';
import { Field } from '@/components/ui/field';
import Link from 'next/link';
import { User } from '@/lib/data';

type ProfileInfoProps = {
  user: User;
};

export function ProfileInfo({ user }: ProfileInfoProps) {
  return (
    <div className="relative p-4 pt-3 flex flex-col space-y-3">
      <div className="flex flex-wrap justify-between items-start gap-2">
        <div className="absolute w-1/4 min-w-12 -mt-[16%] aspect-square">
          <ImagePreview src={user.avatar} variant="avatar">
            <Avatar className="size-full ring-4 ring-background cursor-pointer">
              <AvatarImage src={user.avatar} alt={user.fullname} />
              <AvatarFallback className="text-3xl font-semibold">
                {user.fullname[0]}
              </AvatarFallback>
            </Avatar>
          </ImagePreview>
        </div>
        <Button className="ml-auto rounded-full mb-3">Follow</Button>
        <Button variant="outline" className="rounded-full mb-3">
          Set up profile
        </Button>
      </div>

      {/* NAME */}
      <div className="mt-1">
        <h1 className="text-lg font-bold">{user.fullname}</h1>
        <p className="text-sm text-muted-foreground">@{user.username}</p>
      </div>

      {/* BIO */}
      {user.bio && <div>{user.bio}</div>}

      {/* JOINED */}
      <Link href={`/${user.username}/about`} className="hover:underline">
        <Field
          orientation="horizontal"
          className="text-muted-foreground text-sm gap-2"
        >
          <Calendar className="size-4" />
          <span>Joined October 2023</span>
          <ChevronRight className="size-4" />
        </Field>
      </Link>

      {/* FOLLOW COUNTS */}
      <Field orientation="horizontal" className="text-sm gap-4">
        <Link href={`/${user.username}/following`} className="hover:underline">
          <span className="font-bold">{user.followingCount}</span>
          <span className="text-muted-foreground ml-1">Following</span>
        </Link>

        <Link href={`/${user.username}/followers`} className="hover:underline">
          <span className="font-bold">{user.followersCount}</span>
          <span className="text-muted-foreground ml-1">Followers</span>
        </Link>
      </Field>
    </div>
  );
}
