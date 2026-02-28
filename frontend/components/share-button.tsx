import { DropdownMenu } from '@/components/dropdown-menu';
import { Link, Share } from 'lucide-react';

const shareOptions = [
  {
    label: 'Copy Link',
    icon: Link,
    onSelect: () => {
      console.log('Copy Link');
    },
  },
  {
    label: 'Share Post via ...',
    icon: Share,
    onSelect: () => {
      console.log('Share Post via ...');
    },
  },
];

export function ShareButton() {
  return (
    <DropdownMenu items={shareOptions} triggerIcon={Share} tooltip="Share" />
  );
}
