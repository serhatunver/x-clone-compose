import { UserTabs } from '@/components/user-tabs';
import { ProfileHeader } from '@/components/profile/profile-header';
import { ProfileInfo } from '@/components/profile/profile-info';

import Image from 'next/image';

type PageProps = {
  params: Promise<{
    username: string;
  }>;
};

import { getUserByUsername } from '@/lib/data';

export default async function Page({ params }: PageProps) {
  const { username } = await params;

  const user = await getUserByUsername(username);

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div>
      <ProfileHeader username={username} postCount={user.posts.length} />

      {/* Cover image */}
      <div className="relative h-50 w-full">
        <Image
          src={user.cover}
          alt={`${username}'s cover image`}
          fill
          className="object-cover w-full h-full"
        />
      </div>

      <ProfileInfo user={user} />
      <UserTabs user={user} />
    </div>
  );
}
