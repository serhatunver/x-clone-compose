'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/animate-ui/components/buttons/button';
import { ArrowLeft } from 'lucide-react';
import { AppTooltip } from '@/components/app-tooltip';

export function BackButton() {
  const router = useRouter();

  return (
    <AppTooltip content="Go Back">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
        onClick={() => router.back()}
      >
        <ArrowLeft />
        <span className="sr-only">Go Back</span>
      </Button>
    </AppTooltip>
  );
}
