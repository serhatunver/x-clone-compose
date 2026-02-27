import { Ellipsis, Trash2, Ban, UserPlus } from 'lucide-react';
import { DropdownMenu } from '@/components/dropdown-menu';

const tweetActions = [
  {
    label: 'Follow',
    icon: UserPlus,
    onSelect: () => console.log('Follow'),
  },
  {
    label: 'Block',
    icon: Ban,
    onSelect: () => console.log('Block'),
  },
  {
    label: 'Delete',
    icon: Trash2,
    destructive: true,
    onSelect: () => console.log('Delete'),
  },
];

export function MoreButton() {
  return (
    <DropdownMenu items={tweetActions} triggerIcon={Ellipsis} tooltip="More" />
  );
}
