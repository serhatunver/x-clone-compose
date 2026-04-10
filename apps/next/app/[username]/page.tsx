import Image from 'next/image';
import { UserTabs } from '@/components/user-tabs';
import { PageHeader } from '@/components/page-header';
import { ProfileInfo } from '@/components/profile/profile-info';
import { ProfileSearch } from '@/components/profile/profile-search';
import { ImagePreview } from '@/components/image-preview';

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
      <PageHeader
        title={user.fullname}
        description={`${user.posts?.length} posts`}
        rightAction={
          <ProfileSearch username={user.username} fullname={user.fullname} />
        }
      />

      <ImagePreview src={user.cover} variant="cover">
        <div className="relative cursor-pointer">
          <Image
            src={user.cover}
            alt={`${username}'s cover image`}
            width={1200}
            height={400}
            className="w-full h-auto aspect-3/1 object-cover"
          />
        </div>
      </ImagePreview>

      <ProfileInfo user={user} />
      <UserTabs user={user} />
    </div>
  );
}
