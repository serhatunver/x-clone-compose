import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function UserAvatar() {
  return (
    <Avatar className="size-10 rounded-full">
      <AvatarImage
        src="https://avatars.githubusercontent.com/u/96500903"
        alt="Serhat Ünver"
      />
      <AvatarFallback>SU</AvatarFallback>
    </Avatar>
  );
}
