import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserHoverCard } from '@/components/user-hover-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import type { User } from '@/lib/data';

const recommendedUsers: User[] = [
  {
    _id: '1',
    fullname: 'Alice Johnson',
    username: 'alicejohnson',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    cover:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    bio: 'Tech enthusiast. Coffee lover. Avid traveler.',
    followers: ['1', '2', '3'],
    following: ['2', '3'],
    followersCount: '1200',
    followingCount: '300',
  },
  {
    _id: '2',
    fullname: 'Bob Smith',
    username: 'bobsmith',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    cover:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
    bio: 'Musician. Foodie. Always up for an adventure.',
    followers: ['1', '2'],
    following: ['1', '3'],
    followersCount: '800',
    followingCount: '150',
  },
  {
    _id: '3',
    fullname: 'Charlie Brown',
    username: 'charliebrown',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    cover:
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80',
    bio: 'Artist. Nature lover. Dreamer.',
    followers: ['1'],
    following: ['1', '2'],
    followersCount: '500',
    followingCount: '100',
  },
];

export function WhoToFollow() {
  return (
    <Card className="border rounded-2xl gap-3">
      <CardHeader className="px-4">
        <CardTitle className="text-xl font-bold">Who to follow</CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        {recommendedUsers.map((user) => (
          <div key={user._id} className="flex items-center gap-3 py-2">
            <UserHoverCard user={user}>
              <Link href={`/${user.username}`}>
                <Avatar size="lg">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="rounded-lg">
                    {user.fullname.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </UserHoverCard>
            <div className="flex flex-col">
              <UserHoverCard user={user}>
                <Link href={`/${user.username}`} className="leading-none">
                  <span className="font-medium">{user.fullname}</span>
                </Link>
              </UserHoverCard>
              <UserHoverCard user={user}>
                <Link href={`/${user.username}`}>
                  <span className="text-sm text-muted-foreground">
                    @{user.username}
                  </span>
                </Link>
              </UserHoverCard>
            </div>
            <Button size="sm" className="ml-auto rounded-full">
              Follow
            </Button>
          </div>
        ))}
      </CardContent>
      <CardFooter className="px-4">
        <Link href="#" className="text-sm text-sky-400 hover:underline">
          Show more
        </Link>
      </CardFooter>
    </Card>
  );
}
