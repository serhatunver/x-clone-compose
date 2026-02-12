import { Button } from '@/components/ui/button';
import { Calendar, ChevronRight } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Field } from '@/components/ui/field';
import Link from 'next/link';
import { UserTabs } from '@/components/user-tabs';
import { ProfileHeader } from '@/components/profile/profile-header';
import { ProfileInfo } from '@/components/profile/profile-info';

type PageProps = {
  params: Promise<{
    username: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { username } = await params;

  const user = {
    username: username,
    fullname: 'Serhat Ünver',
    avatar: 'https://avatars.githubusercontent.com/u/96500903',
    bio: 'Profile Description here',
    joinedAt: 'October 2023',
    followers: 0,
    following: 9,
    posts: 1,
  };

  return (
    <div>
      <ProfileHeader username={username} postCount={user.posts} />
      <div className="bg-gray-700 h-50 w-full"></div>
      <ProfileInfo user={user} />
      <UserTabs />
    </div>
  );
}
